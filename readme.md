# remark-toc

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[**remark**][remark] plugin to generate a Table of Contents.

## Install

[npm][]:

```sh
npm install remark-toc
```

## Use

Say we have the following file, `example.md`:

```markdown
# Alpha

## Table of Contents

## Bravo

### Charlie

## Delta
```

And our script, `example.js`, looks as follows:

```js
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

Generate a Table of Contents.

*   Looks for the first heading containing `'Table of Contents'`, `'toc'`,
    or `'table-of-contents'` (case insensitive, supports alt/title attributes
    for links and images too)
*   Removes all following contents until an equal or higher heading is found
*   Inserts a list representation of the hierarchy of following headings
*   Links from the table of contents to following headings, using the same slugs
    as GitHub

> **Note**: if you’re later compiling to HTML, you still need to add anchors to
> headings.
> Previously that was done by this plugin as well, but now you must
> [`.use(slug)` to include `remark-slug`][slug] explicitly.

##### `options`

###### `options.heading`

`string?`, default: `'toc|table[ -]of[ -]contents?'` — Heading to look for,
wrapped in `new RegExp('^(' + value + ')$', 'i')`.

###### `options.maxDepth`

`number?`, default: `6` — Maximum heading depth to include in the table of
contents, This is inclusive, thus, when set to `3`, level three headings,
are included (those with three hashes, `###`).

###### `options.tight`

`boolean?`, default: `false` — Whether to compile list-items tightly.

###### `options.skip`

`string?` — Headings to skip, wrapped in `new RegExp('^(' + value + ')$', 'i')`.
Any heading matching this expression will not be present in the table of
contents.

## Related

*   [`remark-slug`][slug]
    – Add anchors to headings using GitHub’s algorithm
*   [`remark-collapse`](https://github.com/Rokt33r/remark-collapse)
    – Make a section collapsible
*   [`remark-normalize-headings`](https://github.com/remarkjs/remark-normalize-headings)
    — Make sure there is no more than a single top-level heading in the document
    and rewrite the rest accordingly
*   [`remark-behead`](https://github.com/mrzmmr/remark-behead)
    — Change header levels
*   [`mdast-util-toc`](https://github.com/syntax-tree/mdast-util-toc)
    — Core functionality of this plugin

## Contribute

See [`contributing.md`][contributing] in [`remarkjs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [Code of Conduct][coc].
By interacting with this repository, organisation, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/remarkjs/remark-toc/master.svg

[build]: https://travis-ci.org/remarkjs/remark-toc

[coverage-badge]: https://img.shields.io/codecov/c/github/remarkjs/remark-toc.svg

[coverage]: https://codecov.io/github/remarkjs/remark-toc

[downloads-badge]: https://img.shields.io/npm/dm/remark-toc.svg

[downloads]: https://www.npmjs.com/package/remark-toc

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-toc.svg

[size]: https://bundlephobia.com/result?p=remark-toc

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/join%20the%20community-on%20spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/remark

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/remarkjs/.github

[contributing]: https://github.com/remarkjs/.github/blob/master/contributing.md

[support]: https://github.com/remarkjs/.github/blob/master/support.md

[coc]: https://github.com/remarkjs/.github/blob/master/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[remark]: https://github.com/remarkjs/remark

[slug]: https://github.com/remarkjs/remark-slug
