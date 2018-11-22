# remark-toc

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Chat][chat-badge]][chat]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]

Generate a Table of Contents in [**remark**][remark].

## Installation

[npm][]:

```bash
npm install remark-toc
```

## Usage

Say we have the following file, `example.md`:

```markdown
# Alpha

## Table of Contents

## Bravo

### Charlie

## Delta
```

And our script, `example.js`, looks as follows:

```javascript
var vfile = require('to-vfile')
var remark = require('remark')
var toc = require('remark-toc')

remark()
  .use(toc)
  .process(vfile.readSync('example.md'), function(err, file) {
    if (err) throw err
    console.log(String(file))
  })
```

Now, running `node example` yields:

```markdown
# Alpha

## Table of Contents

-   [Bravo](#bravo)

    -   [Charlie](#charlie)

-   [Delta](#delta)

## Bravo

### Charlie

## Delta
```

## API

### `remark().use(toc[, options])`

Add a Table of Contents to a Markdown document.

*   Looks for the first heading containing `'Table of Contents'`, `'toc'`,
    or `'table-of-contents'` (case insensitive, supports alt/title attributes
    for links and images too)
*   Removes all following contents until an equal or higher heading is found
*   Inserts a list representation of the hierarchy of following headings
*   Adds links to following headings, using the same slugs as GitHub

##### Options

###### `heading`

`string?`, default: `'toc|table[ -]of[ -]contents?'` — Heading to look for,
wrapped in `new RegExp('^(' + value + ')$', 'i')`.

###### `maxDepth`

`number?`, default: `6` — Maximum heading depth to include in the table of
contents, This is inclusive, thus, when set to `3`, level three headings,
are included (those with three hashes, `###`).

###### `tight`

`boolean?`, default: `false` — Whether to compile list-items tightly.

## Related

*   [`remark-collapse`](https://github.com/Rokt33r/remark-collapse)
    – Make a section collapsible
*   [`remark-normalize-headings`](https://github.com/eush77/remark-normalize-headings)
    — Make sure there is no more than a single top-level heading in the document
    and rewrite the rest accordingly
*   [`remark-rewrite-headers`](https://github.com/strugee/remark-rewrite-headers)
    — Change header levels
*   [`mdast-util-toc`](https://github.com/barrythepenguin/mdast-util-toc)
    — Core functionality of this plugin

## Contribute

See [`contributing.md` in `remarkjs/remark`][contributing] for ways to get
started.

This organisation has a [Code of Conduct][coc].  By interacting with this
repository, organisation, or community you agree to abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/remarkjs/remark-toc.svg

[build]: https://travis-ci.org/remarkjs/remark-toc

[coverage-badge]: https://img.shields.io/codecov/c/github/remarkjs/remark-toc.svg

[coverage]: https://codecov.io/github/remarkjs/remark-toc

[downloads-badge]: https://img.shields.io/npm/dm/remark-toc.svg

[downloads]: https://www.npmjs.com/package/remark-toc

[chat-badge]: https://img.shields.io/badge/join%20the%20community-on%20spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/remark

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[license]: license

[author]: https://wooorm.com

[npm]: https://docs.npmjs.com/cli/install

[remark]: https://github.com/remarkjs/remark

[contributing]: https://github.com/remarkjs/remark/blob/master/contributing.md

[coc]: https://github.com/remarkjs/remark/blob/master/code-of-conduct.md
