'use strict';

/*
 * Dependencies.
 */

var slug = require('slug');

/**
 * Get the value of `node`.
 *
 * @param {Node} node
 * @return {string}
 */
function getValue(node) {
    return node &&
        (node.value ? node.value :
        (node.alt ? node.alt : node.title)) || '';
}

/**
 * Returns the text content of a node.
 * Checks `alt` or `title` when no value or children
 * exist.
 *
 * @param {Node} node
 * @return {string}
 */
function toString(node) {
    return getValue(node) ||
        (node.children && node.children.map(toString).join('')) ||
        '';
}

/**
 * Check if `node` is the main heading.
 *
 * @param {Node} node
 * @return {boolean}
 */
function isOpeningHeading(node, depth) {
    return depth === null && node && node.type === 'heading' &&
        /^(toc|table[ -]of[ -]contents?)$/i.test(toString(node));
}

/**
 * Check if `node` is the next heading.
 *
 * @param {Node} node
 * @param {number} depth
 * @return {boolean}
 */
function isClosingHeading(node, depth) {
    return depth && node && node.type === 'heading' && node.depth <= depth;
}

/**
 * Search a node for a location.
 *
 * @param {Node} root
 * @return {Object}
 */
function search(root) {
    var index = -1;
    var length = root.children.length;
    var depth = null;
    var lookingForToc = true;
    var map = [];
    var child;
    var headingIndex;
    var closingIndex;
    var value;

    while (++index < length) {
        child = root.children[index];

        if (lookingForToc) {
            if (isClosingHeading(child, depth)) {
                closingIndex = index;
                lookingForToc = false;
            }

            if (isOpeningHeading(child, depth)) {
                headingIndex = index + 1;
                depth = child.depth;
            }
        }

        if (!lookingForToc && child.type === 'heading') {
            value = toString(child);

            if (value) {
                map.push({
                    'depth': child.depth,
                    'value': value
                });
            }
        }
    }

    if (headingIndex) {
        if (!closingIndex) {
            closingIndex = length + 1;
        }

        /*
         * Remove current TOC.
         */

        root.children.splice(headingIndex, closingIndex - headingIndex);
    }

    return {
        'index': headingIndex || null,
        'map': map
    };
}

/**
 * Create a list.
 *
 * @return {Object}
 */
function list() {
    return {
        'type': 'list',
        'ordered': false,
        'children': []
    };
}

/**
 * Create a list item.
 *
 * @return {Object}
 */
function listItem() {
    return {
        'type': 'listItem',
        'loose': false,
        'children': []
    };
}

/**
 * Insert a `node` into a `parent`.
 *
 * @param {Object} node
 * @param {Object} parent
 */
function insert(node, parent) {
    var children = parent.children;
    var last = children[children.length - 1];
    var item;

    if (node.depth === 1) {
        item = listItem();

        item.children.push({
            'type': 'paragraph',
            'children': [
                {
                    'type': 'link',
                    'title': null,
                    'href': '#' + slug(node.value.toLowerCase()),
                    'children': [
                        {
                            'type': 'text',
                            'value': node.value
                        }
                    ]
                }
            ]
        });

        children.push(item);
    } else if (last && last.type === 'listItem') {
        insert(node, last);
    } else if (last && last.type === 'list') {
        node.depth--;

        insert(node, last);
    } else if (parent.type === 'list') {
        item = listItem();

        item.loose = true;

        insert(node, item);

        children.push(item);
    } else {
        item = list();
        node.depth--;

        insert(node, item);

        children.push(item);
    }
}

/**
 * Transform a list of heading objects to a markdown list.
 *
 * @param {Array.<Object>} map
 * @return {Object}
 */
function contents(map) {
    var minDepth = Infinity;
    var index = -1;
    var length = map.length;
    var table;

    /*
     * Fin minimum depth.
     */

    while (++index < length) {
        if (map[index].depth < minDepth) {
            minDepth = map[index].depth;
        }
    }

    /*
     * Normalize depth.
     */

    index = -1;

    while (++index < length) {
        map[index].depth -= minDepth - 1;
    }

    /*
     * Construct the main list.
     */

    table = list();

    /*
     * Add TOC to list.
     */

    index = -1;

    while (++index < length) {
        insert(map[index], table);
    }

    return table;
}

/**
 * Adds an example section based on a valid example
 * JavaScript document to a `Usage` section.
 *
 * @param {Node} node
 */
function transformer(node) {
    var result = search(node);

    if (result.index === null || !result.map.length) {
        return;
    }

    /*
     * Add markdown.
     */

    node.children = [].concat(
        node.children.slice(0, result.index),
        contents(result.map),
        node.children.slice(result.index)
    );
}

/**
 * Attacher.
 *
 * @return {function(node)}
 */
function attacher() {
    return transformer;
}

/*
 * Expose.
 */

module.exports = attacher;
