'use strict';

/*
 * Dependencies.
 */

var repeat = require('repeat-string');

var slugg = null;
var fs = {};
var path = {};
var proc = {};

try {
    slugg = require('slugg');
} catch (exception) {/* empty */}

try {
    fs = require('fs');
} catch (exception) {/* empty */}

try {
    path = require('path');
} catch (exception) {/* empty */}

/*
 * Hide process use from browserify and component.
 */

/* istanbul ignore else */
if (typeof global !== 'undefined' && global.process) {
    proc = global.process;
}

/*
 * Methods.
 */

var exists = fs.existsSync;
var resolve = path.resolve;

/*
 * Constants.
 */

var MODULES = 'node_modules';
var EMPTY = '';
var HEADING = 'heading';
var LIST = 'list';
var LIST_ITEM = 'listItem';
var PARAGRAPH = 'paragraph';
var LINK = 'link';
var TEXT = 'text';
var EXTENSION = '.js';
var NPM = 'npm';
var GITHUB = 'github';
var SLUGG = 'slugg';
var DASH = '-';

var DEFAULT_HEADING = 'toc|table[ -]of[ -]contents?';
var DEFAULT_LIBRARY = GITHUB;

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
 * Get the value of `node`.
 *
 * @param {Node} node
 * @return {string}
 */
function getValue(node) {
    return node &&
        (node.value ? node.value :
        (node.alt ? node.alt : node.title)) || EMPTY;
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
        (node.children && node.children.map(toString).join(EMPTY)) ||
        EMPTY;
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
 * @return {Object}
 */
function search(root, expression) {
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

            if (isOpeningHeading(child, depth, expression)) {
                headingIndex = index + 1;
                depth = child.depth;
            }
        }

        if (!lookingForToc && child.type === HEADING) {
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
function insert(node, parent, library) {
    var children = parent.children;
    var last = children[children.length - 1];
    var item;

    if (node.depth === 1) {
        item = listItem();

        item.children.push({
            'type': PARAGRAPH,
            'children': [
                {
                    'type': LINK,
                    'title': null,
                    'href': '#' + library(node.value),
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
        insert(node, last, library);
    } else if (last && last.type === LIST) {
        node.depth--;

        insert(node, last, library);
    } else if (parent.type === LIST) {
        item = listItem();

        item.loose = true;

        insert(node, item, library);

        children.push(item);
    } else {
        item = list();
        node.depth--;

        insert(node, item, library);

        children.push(item);
    }
}

/**
 * Transform a list of heading objects to a markdown list.
 *
 * @param {Array.<Object>} map
 * @return {Object}
 */
function contents(map, library) {
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
        insert(map[index], table, library);
    }

    return table;
}

/**
 * Find a library.
 *
 * @param {string} pathlike
 * @return {Object}
 */
function loadLibrary(pathlike) {
    var cwd;
    var local;
    var npm;
    var plugin;

    if (pathlike === SLUGG && slugg) {
        return slugg;
    }

    cwd = proc.cwd && proc.cwd();

    /* istanbul ignore if */
    if (!cwd) {
        throw new Error('Cannot lazy load library when not in node');
    }

    local = resolve(cwd, pathlike);
    npm = resolve(cwd, MODULES, pathlike);

    if (exists(local) || exists(local + EXTENSION)) {
        plugin = local;
    } else if (exists(npm)) {
        plugin = npm;
    } else {
        plugin = pathlike;
    }

    return require(plugin);
}

/**
 * Wraps `slugg` to generate slugs just like npm would.
 *
 * @see https://github.com/npm/marky-markdown/blob/9761c95/lib/headings.js#L17
 *
 * @param {function(string): string} library
 * @return {function(string): string}
 */
function npmFactory(library) {
    /**
     * Generate slugs just like npm would.
     *
     * @param {string} value
     * @return {string}
     */
    function npm(value) {
        return library(value).replace(/[<>]/g, '').toLowerCase();
    }

    return npm;
}

/**
 * Wraps `slugg` to generate slugs just like GitHub would.
 *
 * @param {function(string): string} library
 * @return {function(string): string}
 */
function githubFactory(library) {
    /**
     * Hacky.  Sometimes `slugg` uses `replacement` as an
     * argument to `String#replace()`, and sometimes as
     * a literal string.
     *
     * @param {string} $0
     * @return {string}
     */
    function separator($0) {
        var match = $0.match(/\s/g);

        return repeat(DASH, match ? match.length : 0);
    }

    /**
     * @see seperator
     * @return {string}
     */
    function dash() {
        return DASH;
    }

    separator.toString = dash;

    /**
     * Generate slugs just like GitHub would.
     *
     * @param {string} value
     * @return {string}
     */
    function github(value) {
        return library(value, separator).toLowerCase();
    }

    return github;
}

/**
 * Attacher.
 *
 * @return {function(node)}
 */
function attacher(mdast, options) {
    var settings = options || {};
    var heading = toExpression(settings.heading || DEFAULT_HEADING);
    var library = settings.library || DEFAULT_LIBRARY;
    var isNPM = library === NPM;
    var isGitHub = library === GITHUB;

    if (isNPM || isGitHub) {
        library = SLUGG;
    }

    if (typeof library === 'string') {
        library = loadLibrary(library);
    }

    if (isNPM) {
        library = npmFactory(library);
    } else if (isGitHub) {
        library = githubFactory(library);
    }

    /**
     * Adds an example section based on a valid example
     * JavaScript document to a `Usage` section.
     *
     * @param {Node} node
     */
    function transformer(node) {
        var result = search(node, heading);

        if (result.index === null || !result.map.length) {
            return;
        }

        /*
         * Add markdown.
         */

        node.children = [].concat(
            node.children.slice(0, result.index),
            contents(result.map, library),
            node.children.slice(result.index)
        );
    }

    return transformer;
}

/*
 * Expose.
 */

module.exports = attacher;
