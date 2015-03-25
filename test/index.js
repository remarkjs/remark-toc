'use strict';

/*
 * Dependencies.
 */

var mdastTOC = require('..');
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

/*
 * Constants.
 */

var ROOT = path.join(__dirname, 'fixtures');

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
function toc(value) {
    return mdast.stringify(mdast.use(mdastTOC).parse(value));
}

/*
 * Tests.
 */

describe('mdast-toc()', function () {
    it('should be a function', function () {
        assert(typeof mdastTOC === 'function');
    });

    it('should not throw if not passed options', function () {
        assert.doesNotThrow(function () {
            mdastTOC(mdast);
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
        var filepath = ROOT + '/' + fixture;
        var output = read(filepath + '/Output.md', 'utf-8');
        var input = read(filepath + '/Input.md', 'utf-8');
        var result = toc(input);
        var difference;

        try {
            assert(result === output);
        } catch (exception) {
            difference = diff.diffLines(output, result);

            difference.forEach(function (change) {
                var colour = change.added ?
                    'green' : change.removed ? 'red' : 'dim';

                process.stderr.write(chalk[colour](change.value));
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
