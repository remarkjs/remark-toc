# remark-toc [![Build Status](https://img.shields.io/travis/wooorm/remark-toc.svg)](https://travis-ci.org/wooorm/remark-toc) [![Coverage Status](https://img.shields.io/codecov/c/github/wooorm/remark-toc.svg)](https://codecov.io/github/wooorm/remark-toc)

Generate a Table of Contents (TOC) for [Markdown](http://daringfireball.net/projects/markdown/syntax)
files with [remark](https://github.com/wooorm/remark).

> :warning: **mdast is currently being renamed to remark** :warning:
> 
> This means all plug-ins and relating projects change too, causing many
> changes across the ecosystem. Expect the dust to settle in roughly a day.
> 
> See this project at the previous stable commit
> [c4a51d1](https://github.com/wooorm/remark-github/commit/c4a51d1).

## Installation

[npm](https://docs.npmjs.com/cli/install):

```bash
npm install remark-toc
```

[Component.js](https://github.com/componentjs/component):

```bash
component install wooorm/remark-toc
```

[Bower](http://bower.io/#install-packages):

```bash
bower install remark-toc
```

[Duo](http://duojs.org/#getting-started):

```javascript
var toc = require('wooorm/remark-toc');
```

UMD (globals/AMD/CommonJS) ([uncompressed](remark-toc.js) and [compressed](remark-toc.min.js)):

```html
<script src="path/to/remark.js"></script>
<script src="path/to/remark-toc.js"></script>
<script>
  remark.use(remarkTOC);
</script>
```

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

Parse markdown (this TOC is the 14th child).

```javascript
var contents = remark.run(remark.parse(readme)).children[14];
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
