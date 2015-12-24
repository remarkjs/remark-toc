/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module remark:toc:test
 * @fileoverview Test suite for `remark-toc`.
 */

'use strict';

/* eslint-env mocha */

/*
 * Dependencies.
 */

var toc = require('..');
var mdast = require('mdast');
var assert = require('assert');
var fs = require('fs');
var path = require('path');

/*
 * Methods.
 */

var read = fs.readFileSync;
var exists = fs.existsSync;
var join = path.join;
var equal = assert.strictEqual;

/*
 * Constants.
 */

var ROOT = join(__dirname, 'fixtures');

/*
 * Fixtures.
 */

var fixtures = fs.readdirSync(ROOT);

/**
 * Shortcut to process.
 *
 * @param {string} value - Value to process.
 * @param {Object} config - Configuration for processor.
 * @return {string}
 */
function process(value, config) {
    return mdast().use(toc, config).process(value);
}

/*
 * Tests.
 */

describe('remark-toc()', function () {
    it('should be a function', function () {
        assert(typeof toc === 'function');
    });

    it('should not throw if not passed options', function () {
        assert.doesNotThrow(function () {
            toc(mdast);
        });
    });
});

/**
 * Describe a fixtures.
 *
 * @param {string} fixture - Directory name.
 */
function describeFixture(fixture) {
    it('should work on `' + fixture + '`', function () {
        var filepath = join(ROOT, fixture);
        var output = read(join(filepath, 'output.md'), 'utf-8');
        var input = read(join(filepath, 'input.md'), 'utf-8');
        var config = join(filepath, 'config.json');
        var result;

        config = exists(config) ? JSON.parse(read(config, 'utf-8')) : {};
        result = process(input, config);

        equal(result, output);
    });
}

/*
 * Gather fixtures.
 */

fixtures = fixtures.filter(function (filepath) {
    return filepath.indexOf('.') !== 0;
});

describe('Fixtures', function () {
    fixtures.forEach(describeFixture);
});
