'use strict';

/*
 * Dependencies.
 */

var slug = require('mdast-slug');
var toString = require('mdast-util-to-string');

/*
 * Constants.
 */

var HEADING = 'heading';
var LIST = 'list';
var LIST_ITEM = 'listItem';
var PARAGRAPH = 'paragraph';
var LINK = 'link';
var TEXT = 'text';
var DEFAULT_HEADING = 'toc|table[ -]of[ -]contents?';

/**
 * Transform a string into an applicable expression.
 *
 * @param {string} value
 * @return {RegExp}
 */
function toExpression(value) {
    return new RegExp('^(' + value + ')$', 'i');
}

/**
 * Check if `node` is the main heading.
 *
 * @param {Node} node
 * @return {boolean}
 */
function isOpeningHeading(node, depth, expression) {
    return depth === null && node && node.type === HEADING &&
        expression.test(toString(node));
}

/**
 * Check if `node` is the next heading.
 *
 * @param {Node} node
 * @param {number} depth
 * @return {boolean}
 */
function isClosingHeading(node, depth) {
    return depth && node && node.type === HEADING && node.depth <= depth;
}

/**
 * Search a node for a location.
 *
 * @param {Node} root
 * @param {RegExp} expression
 * @param {number} maxDepth
 * @return {Object}
 */
function search(root, expression, maxDepth) {
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

        if (child.type !== HEADING) {
            continue;
        }

        value = toString(child);

        if (lookingForToc) {
            if (isClosingHeading(child, depth)) {
                closingIndex = index;
                lookingForToc = false;
            }

            if (isOpeningHeading(child, depth, expression)) {
                headingIndex = index + 1;
                depth = child.depth;
            }
        }

        if (!lookingForToc && value && child.depth <= maxDepth) {
            map.push({
                'depth': child.depth,
                'value': value,
                'id': child.attributes.id
            });
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
        'type': LIST,
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
        'type': LIST_ITEM,
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
    var index = -1;
    var length = children.length;
    var last = children[length - 1];
    var isLoose = false;
    var item;

    if (node.depth === 1) {
        item = listItem();

        item.children.push({
            'type': PARAGRAPH,
            'children': [
                {
                    'type': LINK,
                    'title': null,
                    'href': '#' + node.id,
                    'children': [
                        {
                            'type': TEXT,
                            'value': node.value
                        }
                    ]
                }
            ]
        });

        children.push(item);
    } else if (last && last.type === LIST_ITEM) {
        insert(node, last);
    } else if (last && last.type === LIST) {
        node.depth--;

        insert(node, last);
    } else if (parent.type === LIST) {
        item = listItem();

        insert(node, item);

        children.push(item);
    } else {
        item = list();
        node.depth--;

        insert(node, item);

        children.push(item);
    }

    /*
     * Properly style list-items with new lines.
     */

    if (parent.type === LIST_ITEM) {
        parent.loose = children.length > 1;
    } else {
        while (++index < length) {
            if (children[index].loose) {
                isLoose = true;

                break;
            }
        }

        index = -1;

        while (++index < length) {
            children[index].loose = isLoose;
        }
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
     * Find minimum depth.
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
 * Attacher.
 *
 * @return {function(node)}
 */
function attacher(mdast, options) {
    var settings = options || {};
    var heading = toExpression(settings.heading || DEFAULT_HEADING);
    var depth = settings.maxDepth || 6;

    mdast.use(slug, settings.slug);

    /**
     * Adds an example section based on a valid example
     * JavaScript document to a `Usage` section.
     *
     * @param {Node} node
     */
    function transformer(node) {
        var result = search(node, heading, depth);

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

    return transformer;
}

/*
 * Expose.
 */

module.exports = attacher;
