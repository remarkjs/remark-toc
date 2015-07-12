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
 * @param {string} value
 * @return {string}
 */
function process(value, config) {
    return mdast().use(toc, config).process(value);
}

/**
 * Assert two strings.
 *
 * @param {string} actual
 * @param {string} expected
 * @throws {Error} - When not equal.
 */
function assertion(actual, expected) {
    try {
        assert(actual === expected);
    } catch (exception) {
        exception.expected = expected;
        exception.actual = actual;

        throw exception;
    }
}

/*
 * Tests.
 */

describe('mdast-toc()', function () {
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
 * @param {string} fixture
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

        assertion(result, output);
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
