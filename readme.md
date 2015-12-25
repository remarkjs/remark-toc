# remark-toc [![Build Status](https://img.shields.io/travis/wooorm/remark-toc.svg)](https://travis-ci.org/wooorm/remark-toc) [![Coverage Status](https://img.shields.io/codecov/c/github/wooorm/remark-toc.svg)](https://codecov.io/github/wooorm/remark-toc)

Generate a Table of Contents (TOC) for [Markdown](http://daringfireball.net/projects/markdown/syntax)
files with [remark](https://github.com/wooorm/remark).

## Installation

[npm](https://docs.npmjs.com/cli/install):

```bash
npm install remark-toc
```

**remark-toc** is also available for [duo](http://duojs.org/#getting-started),
and as an AMD, CommonJS, and globals module, [uncompressed and
compressed](https://github.com/wooorm/remark-toc/releases).

## Table of Contents

*   [Usage](#usage)

*   [API](#api)

    *   [remark.use(toc, options)](#remarkusetoc-options)

*   [License](#license)

## Usage

Require/read dependencies:

```javascript
var toc = require('remark-toc');
var fs = require('fs');
var remark = require('remark').use(toc);
var readme = fs.readFileSync('readme.md', 'utf-8');
```

Parse markdown (this TOC is the 7th child).

```javascript
var contents = remark.run(remark.parse(readme)).children[7];
```

Stringify:

```javascript
var doc = remark.stringify(contents);
```

Yields:

```markdown
-   [Usage](#usage)

-   [API](#api)

    -   [remark.use(toc, options)](#remarkusetoc-options)

-   [License](#license)
```

## API

### [remark](https://github.com/wooorm/remark#api).[use](https://github.com/wooorm/remark#remarkuseplugin-options)(toc, options)

Adds a [Table of Contents](#table-of-contents) to a Markdown document.

*   Looks for the first heading containing `"Table of Contents"`, `"toc"`,
    or `table-of-contents` (case insensitive, supports alt/title attributes
    for links and images too);

*   Removes all following contents until an equal or higher heading is found;

*   Inserts a list representation of the hierarchy of following headings;

*   Adds links to following headings, using the same slugs as GitHub.

**Signatures**

*   `remark.use(toc, options?)`.

**Parameters**

*   `toc` — This plugin;

*   `options` (`Object?`) — Settings:

    *   `slug` —
        Passed to [`remark-slug`](https://github.com/wooorm/remark-slug)

    *   `heading` (`string?`, default: `"toc|table[ -]of[ -]contents?"`)
        — Heading to look for, wrapped in
        `new RegExp('^(' + value + ')$', 'i');`.

    *   `maxDepth` (`number?`, default: `6`)
        — Maximum heading depth to include in the table of contents,
        This is inclusive, thus, when set to `3`, level three headings,
        are included (those with three hashes, `###`).

    *   `tight` (`boolean?`, default: `false`)
        — Whether to compile list-items tightly.

## License

[MIT](LICENSE) © [Titus Wormer](http://wooorm.com)
