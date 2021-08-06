import fs from 'fs'
import path from 'path'
import test from 'tape'
import {remark} from 'remark'
import {isHidden} from 'is-hidden'
import remarkToc from '../index.js'

test('Fixtures', function (t) {
  var root = path.join('test', 'fixtures')
  var fixtures = fs.readdirSync(root)
  var index = -1
  var fixture
  var config

  while (++index < fixtures.length) {
    fixture = fixtures[index]

    if (isHidden(fixture)) {
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
        .use(remarkToc, config)
        .processSync(fs.readFileSync(path.join(root, fixture, 'input.md')))
        .toString(),
      String(fs.readFileSync(path.join(root, fixture, 'output.md'))),
      'should work on `' + fixture + '`'
    )
  }

  t.end()
})
