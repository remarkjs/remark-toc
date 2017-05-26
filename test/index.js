'use strict';

var test = require('tape');
var fs = require('fs');
var path = require('path');
var remark = require('remark');
var negate = require('negate');
var hidden = require('is-hidden');
var toc = require('..');

var read = fs.readFileSync;
var exists = fs.existsSync;
var join = path.join;

var ROOT = join(__dirname, 'fixtures');

var fixtures = fs.readdirSync(ROOT);

function process(value, config) {
  return remark().use(toc, config).processSync(value).toString();
}

test('remark-toc()', function (t) {
  t.equal(typeof toc, 'function', 'should be a function');

  t.doesNotThrow(function () {
    toc.call(remark());
  }, 'should not throw if not passed options');

  t.end();
});

test('Fixtures', function (t) {
  fixtures.filter(negate(hidden)).forEach(function (fixture) {
    var filepath = join(ROOT, fixture);
    var output = read(join(filepath, 'output.md'), 'utf-8');
    var input = read(join(filepath, 'input.md'), 'utf-8');
    var config = join(filepath, 'config.json');
    var fn;
    var result;

    config = exists(config) ? JSON.parse(read(config, 'utf-8')) : {};
    result = process(input, config);

    fn = path.basename(filepath) === 'unicode' ? t.skip : t.equal;

    fn(result, output, 'should work on `' + fixture + '`');
  });

  t.end();
});
