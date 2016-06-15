/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module remark:toc:test
 * @fileoverview Test suite for `remark-toc`.
 */

'use strict';

/* eslint-env node */

/*
 * Dependencies.
 */

var test = require('tape');
var fs = require('fs');
var path = require('path');
var remark = require('remark');
var toc = require('..');

/*
 * Methods.
 */

var read = fs.readFileSync;
var exists = fs.existsSync;
var join = path.join;

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
 * @param {boolean?} [light] - Process with transformer.
 * @return {string} - Processed `value`.
 */
function process(value, config, light) {
    if (light) {
        return remark().use(toc.light, config).process(value).toString();
    }

    return remark().use(toc, config).process(value).toString();
}

/*
 * Tests.
 */

test('remark-toc()', function (t) {
    t.equal(typeof toc, 'function', 'should be a function');
    t.equal(typeof toc.light, 'function', 'should be a function');

    t.doesNotThrow(function () {
        toc(remark());
    }, 'should not throw if not passed options');

    t.doesNotThrow(function () {
        toc.light(remark());
    }, 'should not throw if not passed options');

    t.end();
});

/*
 * Fixtures.
 */

test('Fixtures', function (t) {
    fixtures.filter(function (filepath) {
        return filepath.indexOf('.') !== 0;
    }).forEach(function (fixture) {
        var filepath = join(ROOT, fixture);
        var output = read(join(filepath, 'output.md'), 'utf-8');
        var input = read(join(filepath, 'input.md'), 'utf-8');
        var config = join(filepath, 'config.json');
        var result;

        config = exists(config) ? JSON.parse(read(config, 'utf-8')) : {};
        result = process(input, config);

        t.equal(result, output, 'should work on `' + fixture + '`');
    });

    t.end();
});

test('Fixtures', function (t) {
    fixtures.filter(function (filepath) {
        return filepath.indexOf('.') !== 0;
    }).forEach(function (fixture) {
        var filepath = join(ROOT, fixture);
        var output = read(join(filepath, 'light-output.md'), 'utf-8');
        var input = read(join(filepath, 'input.md'), 'utf-8');
        var config = join(filepath, 'config.json');
        var result;

        config = exists(config) ? JSON.parse(read(config, 'utf-8')) : {};
        result = process(input, config, true);

        t.equal(result, output, 'should work on `' + fixture + '`');
    });

    t.end();
});
