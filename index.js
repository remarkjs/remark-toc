/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module remark:toc
 * @fileoverview Generate a Table of Contents (TOC) for Markdown files.
 */

'use strict';

/* eslint-env commonjs */

/*
 * Dependencies.
 */

var toc = require('mdast-util-toc');

/*
 * Constants.
 */

var DEFAULT_HEADING = 'toc|table[ -]of[ -]contents?';

/**
 * Attacher.
 *
 * @param {Unified} processor - Processor.
 * @param {Object} options - Configuration.
 * @return {function(node)} - Transformmer.
 */
function attacher(processor, options) {
    var settings = options || {};
    var heading = settings.heading || DEFAULT_HEADING;
    var depth = settings.maxDepth || 6;
    var tight = settings.tight;

    /**
     * Adds an example section based on a valid example
     * JavaScript document to a `Usage` section.
     *
     * @param {Node} node - Root to search in.
     */
    function transformer(node) {
        var result = toc(node, {
            'heading': heading,
            'maxDepth': depth,
            'tight': tight
        });

        if (result.index === null || result.map === null) {
            return;
        }

        /*
         * Add markdown.
         */

        node.children = [].concat(
            node.children.slice(0, result.index),
            result.map,
            node.children.slice(result.index)
        );
    }

    return transformer;
}

/*
 * Expose.
 */

module.exports = attacher;
