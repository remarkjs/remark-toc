# remark-toc [![Build Status][build-badge]][build-status] [![Coverage Status][coverage-badge]][coverage-status] [![Chat][chat-badge]][chat]

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
var vfile = require('to-vfile');
var remark = require('remark');
var toc = require('remark-toc');

remark()
  .use(toc)
  .process(vfile.readSync('example.md'), function (err, file) {
    if (err) throw err;
    console.log(String(file));
  });
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

*   Looks for the first heading containing `"Table of Contents"`, `"toc"`,
    or `table-of-contents` (case insensitive, supports alt/title attributes
    for links and images too)
*   Removes all following contents until an equal or higher heading is found
*   Inserts a list representation of the hierarchy of following headings
*   Adds links to following headings, using the same slugs as GitHub

###### `options`

*   `heading` (`string?`, default: `"toc|table[ -]of[ -]contents?"`)
    — Heading to look for, wrapped in `new RegExp('^(' + value + ')$', 'i');`
*   `maxDepth` (`number?`, default: `6`)
    — Maximum heading depth to include in the table of contents,
    This is inclusive, thus, when set to `3`, level three headings,
    are included (those with three hashes, `###`)
*   `tight` (`boolean?`, default: `false`)
    — Whether to compile list-items tightly

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

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/wooorm/remark-toc.svg

[build-status]: https://travis-ci.org/wooorm/remark-toc

[coverage-badge]: https://img.shields.io/codecov/c/github/wooorm/remark-toc.svg

[coverage-status]: https://codecov.io/github/wooorm/remark-toc

[chat-badge]: https://img.shields.io/gitter/room/wooorm/remark.svg

[chat]: https://gitter.im/wooorm/remark

[license]: LICENSE

[author]: http://wooorm.com

[npm]: https://docs.npmjs.com/cli/install

[remark]: https://github.com/wooorm/remark
