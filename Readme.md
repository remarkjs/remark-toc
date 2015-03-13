# mdast-toc [![Build Status](https://img.shields.io/travis/wooorm/mdast-toc.svg?style=flat)](https://travis-ci.org/wooorm/mdast-toc) [![Coverage Status](https://img.shields.io/coveralls/wooorm/mdast-toc.svg?style=flat)](https://coveralls.io/r/wooorm/mdast-toc?branch=master)

Generate a Table of Contents (TOC) for [Markdown](http://daringfireball.net/projects/markdown/syntax) files with [mdast](https://github.com/wooorm/mdast).

## Installation

[npm](https://docs.npmjs.com/cli/install):

```bash
$ npm install mdast-toc
```

[Component.js](https://github.com/componentjs/component):

```bash
$ component install wooorm/mdast-toc
```

[Bower](http://bower.io/#install-packages):

```bash
$ bower install mdast-toc
```

[Duo](http://duojs.org/#getting-started):

```javascript
var toc = require('wooorm/mdast-toc');
```

UMD (globals/AMD/CommonJS) ([uncompressed](mdast-toc.js) and [compressed](mdast-toc.min.js)):

```html
<script src="path/to/mdast.js"></script>
<script src="path/to/mdast-toc.js"></script>
<script>
  mdast.use(mdastTOC);
</script>
```

## Table of Contents

-   [Usage](#usage)
-   [API](#api)
    -   [mdast.use(toc)](#mdastusetoc)
-   [CLI](#cli)
-   [License](#license)

## Usage

Require/read dependencies:

```javascript
var toc = require('mdast-toc');
var fs = require('fs');
var mdast = require('mdast').use(toc);
var readme = fs.readFileSync('Readme.md', 'utf-8');
```

Parse markdown (this TOC is the 14th child).

```javascript
var contents = mdast.parse(readme).children[14];
```

Stringify:

```javascript
var doc = mdast.stringify(contents);
```

Yields:

```markdown
-   [Usage](#usage)
-   [API](#api)
    -   [mdast.use(toc)](#mdastusetoc)
-   [CLI](#cli)
-   [License](#license)
```

## API

### [mdast](https://github.com/wooorm/mdast#api).[use](https://github.com/wooorm/mdast#mdastuseplugin)(toc)

Adds a [Table of Contents](#table-of-contents) to a Markdown document.

-   Looks for the first heading containing `"Table of Contents"`, `"toc"`, or `table-of-contents` (case insensitive, supports alt/title attributes for links and images too);
-   Removes all following contents until an equal or higher heading is found;
-   Inserts a list representation of the hierarchy of following headings;
-   Adds links to following headings, using the same slugs as GitHub.

## CLI

A simple wrapper around `mdast --use mdast-toc`.

Install:

```bash
$ npm install --global mdast-toc
```

Use:

```text
Usage: mdast-toc [mdast options]

Remove markdown formatting

Options:

  -h, --help            output usage information
  -v, --version         output version number

A wrapper around `mdast --use mdast-toc`

Help for mdast:

  https://github.com/wooorm/mdast

Usage:

# Pass `Readme.md` through mdast-toc
$ mdast-toc Readme.md -o Readme.md

# Pass stdin through mdast-toc, with mdast options, and write to stdout
$ cat Docs.md | mdast-toc --option setext > Docs-new.md

# Use other plugins
$ npm install mdast-usage
$ mdast-toc --use mdast-usage Readme.md
```

## License

[MIT](LICENSE) © [Titus Wormer](http://wooorm.com)
