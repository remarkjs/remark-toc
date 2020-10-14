'use strict'

var fs = require('fs')
var path = require('path')
var test = require('tape')
var remark = require('remark')
var negate = require('negate')
var hidden = require('is-hidden')
var toc = require('..')

var read = fs.readFileSync
var join = path.join

var root = join(__dirname, 'fixtures')

var fixtures = fs.readdirSync(root)

function process(value, config) {
  return remark()
    .use({settings: {bullet: '-'}})
    .use(toc, config)
    .processSync(value)
    .toString()
}

test('remark-toc()', function (t) {
  t.equal(typeof toc, 'function', 'should be a function')

  t.doesNotThrow(function () {
    toc.call(remark())
  }, 'should not throw if not passed options')

  t.end()
})

test('Fixtures', function (t) {
  fixtures.filter(negate(hidden)).forEach(function (fixture) {
    var filepath = join(root, fixture)
    var output = read(join(filepath, 'output.md'), 'utf-8')
    var input = read(join(filepath, 'input.md'), 'utf-8')
    var config
    var result

    try {
      config = JSON.parse(read(join(filepath, 'config.json')))
    } catch (_) {
      config = {}
    }

    result = process(input, config)

    t.equal(result, output, 'should work on `' + fixture + '`')
  })

  t.end()
})
