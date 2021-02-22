'use strict'

var fs = require('fs')
var path = require('path')
var test = require('tape')
var remark = require('remark')
var hidden = require('is-hidden')
var toc = require('..')

test('Fixtures', function (t) {
  var root = path.join(__dirname, 'fixtures')
  var fixtures = fs.readdirSync(root)
  var index = -1
  var fixture
  var config

  while (++index < fixtures.length) {
    fixture = fixtures[index]

    if (hidden(fixture)) {
      continue
    }

    try {
      config = JSON.parse(
        fs.readFileSync(path.join(root, fixture, 'config.json'))
      )
    } catch (_) {
      config = {}
    }

    t.equal(
      remark()
        .use({settings: {bullet: '-'}})
        .use(toc, config)
        .processSync(fs.readFileSync(path.join(root, fixture, 'input.md')))
        .toString(),
      String(fs.readFileSync(path.join(root, fixture, 'output.md'))),
      'should work on `' + fixture + '`'
    )
  }

  t.end()
})
