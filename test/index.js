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
var diff = require('diff');
var chalk = require('chalk');

/*
 * Methods.
 */

var read = fs.readFileSync;
var exists = fs.existsSync;
var join = path.join;
var stderr = global.process.stderr;

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

        assert(process(input, {
            'library': require('to-slug-case')
        }) === output);
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

        assert(process(input, {
            'library': 'node_modules/to-slug-case/index'
        }) === output);
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
        var difference;

        config = exists(config) ? JSON.parse(read(config, 'utf-8')) : {};
        result = process(input, config);

        try {
            assert(result === output);
        } catch (exception) {
            difference = diff.diffLines(output, result);

            difference.forEach(function (change) {
                var colour = change.added ?
                    'green' : change.removed ? 'red' : 'dim';

                stderr.write(chalk[colour](change.value));
            });

            throw exception;
        }
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
