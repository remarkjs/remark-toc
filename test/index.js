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

    it('should accept `library` as a function', function () {
        var input = [
            '# Normal',
            '',
            '## Table of Contents',
            '',
            '# I ♥ unicode',
            ''
        ].join('\n');

        var output = [
            '# Normal',
            '',
            '## Table of Contents',
            '',
            '-   [I ♥ unicode](#i-unicode)',
            '',
            '# I ♥ unicode',
            ''
        ].join('\n');

        assertion(process(input, {
            'library': require('to-slug-case')
        }), output);
    });

    it('should accept `library` as a file', function () {
        var input = [
            '# Normal',
            '',
            '## Table of Contents',
            '',
            '# I ♥ unicode',
            ''
        ].join('\n');

        var output = [
            '# Normal',
            '',
            '## Table of Contents',
            '',
            '-   [I ♥ unicode](#i-unicode)',
            '',
            '# I ♥ unicode',
            ''
        ].join('\n');

        assertion(process(input, {
            'library': 'node_modules/to-slug-case/index'
        }), output);
    });

    it('should add `attributes.id` to headings', function () {
        var ast = mdast.parse([
            '# Normal',
            '',
            '## Table of Contents',
            '',
            '# Baz',
            ''
        ].join('\n'));

        mdast().use(toc).run(ast);

        assert(ast.children[0].attributes.id === 'normal');
        assert(ast.children[1].attributes.id === 'table-of-contents');
        assert(ast.children[3].attributes.id === 'baz');
    });

    it('should not overwrite `attributes` on headings', function () {
        var ast = mdast.parse([
            '# Normal',
            '',
            '## Table of Contents',
            '',
            '# Baz',
            ''
        ].join('\n'));

        ast.children[0].attributes = {
            'class': 'bar'
        };

        mdast().use(toc).run(ast);

        assert(ast.children[0].attributes.class === 'bar');
    });

    it('should throw when a plugin cannot be found', function () {
        assert.throws(function () {
            process('', {
                'library': 'foo'
            });
        }, /Cannot find module 'foo'/);
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
