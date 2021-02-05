# remark-toc

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[**remark**][remark] plugin to generate a table of contents.

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

Generate a table of contents.

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

All options are passed to [`mdast-util-toc`][util], with the exception that
`heading` defaults to `'toc|table[ -]of[ -]contents?'`.

## Security

Use of `remark-toc` involves user content and changes the tree, so it can open
you up for a [cross-site scripting (XSS)][xss] attack.

Existing nodes are copied into the table of contents.
The following example shows how an existing script is copied into the table of
contents.

The following Markdown:

```markdown
# Table of Contents

## Bravo<script>alert(1)</script>

## Charlie
```

Yields:

```markdown
# Table of Contents

-   [Bravo<script>alert(1)</script>](#bravoscriptalert1script)
-   [Charlie](#charlie)

## Bravo<script>alert(1)</script>

## Charlie
```

This may become a problem if the Markdown is later transformed to
[**rehype**][rehype] ([**hast**][hast]) or opened in an unsafe Markdown viewer.

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

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/remarkjs/remark-toc/workflows/main/badge.svg

[build]: https://github.com/remarkjs/remark-toc/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/remarkjs/remark-toc.svg

[coverage]: https://codecov.io/github/remarkjs/remark-toc

[downloads-badge]: https://img.shields.io/npm/dm/remark-toc.svg

[downloads]: https://www.npmjs.com/package/remark-toc

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-toc.svg

[size]: https://bundlephobia.com/result?p=remark-toc

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/remarkjs/remark/discussions

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/remarkjs/.github

[contributing]: https://github.com/remarkjs/.github/blob/HEAD/contributing.md

[support]: https://github.com/remarkjs/.github/blob/HEAD/support.md

[coc]: https://github.com/remarkjs/.github/blob/HEAD/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[remark]: https://github.com/remarkjs/remark

[slug]: https://github.com/remarkjs/remark-slug

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting

[rehype]: https://github.com/rehypejs/rehype

[hast]: https://github.com/syntax-tree/hast

[util]: https://github.com/syntax-tree/mdast-util-toc#options
