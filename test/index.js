import fs from 'fs'
import path from 'path'
import test from 'tape'
import {remark} from 'remark'
import {isHidden} from 'is-hidden'
import remarkToc from '../index.js'

test('Fixtures', (t) => {
  const root = path.join('test', 'fixtures')
  const fixtures = fs.readdirSync(root)
  let index = -1

  while (++index < fixtures.length) {
    const fixture = fixtures[index]

    if (isHidden(fixture)) {
      continue
    }

    let config

    try {
      config = JSON.parse(
        fs.readFileSync(path.join(root, fixture, 'config.json'))
      )
    } catch {
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
