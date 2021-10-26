# remark-toc

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[**remark**][remark] plugin to generate a table of contents.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`unified().use(remarkToc[, options])`](#unifieduseremarktoc-options)
*   [Examples](#examples)
    *   [Example: a different heading](#example-a-different-heading)
    *   [Example: ordered, tight list](#example-ordered-tight-list)
    *   [Example: including and excluding headings](#example-including-and-excluding-headings)
    *   [Example: adding a prefix](#example-adding-a-prefix)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Security](#security)
*   [Related](#related)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package is a [unified][] ([remark][]) plugin to generate a table of
contents of the document such as the one above.

**unified** is a project that transforms content with abstract syntax trees
(ASTs).
**remark** adds support for markdown to unified.
**mdast** is the markdown AST that remark uses.
This is a remark plugin that transforms mdast.

## When should I use this?

This project is useful when authors are writing docs in markdown that are
sometimes quite long and hence would benefit from automated overviews inside
them.
It is assumed that headings define the structure of documents and that they can
be linked to.
When this plugin is used, authors can add a certain heading (say, `## Contents`)
to documents and this plugin will populate those sections with lists that link
to all following sections.

GitHub and similar services automatically add IDs (and anchors that
link-to-self) to headings.
You can add similar features when combining remark with [rehype][] through
[`remark-rehype`][remark-rehype] after this plugin.
Then it’s possible to use the rehype plugins [`rehype-slug`][rehype-slug] (for
IDs on headings) and [`rehype-autolink-headings`][rehype-autolink-headings] (for
anchors that link-to-self).

This plugin does not generate a table of contents for the *whole* document or
expose it to other plugins.
You can use the underlying mdast utility [`mdast-util-toc`][mdast-util-toc] and
[create a plugin][create-a-plugin] yourself to do that and more.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install remark-toc
```

In Deno with [Skypack][]:

```js
import remarkToc from 'https://cdn.skypack.dev/remark-toc@8?dts'
```

In browsers with [Skypack][]:

```html
<script type="module">
  import remarkToc from 'https://cdn.skypack.dev/remark-toc@8?min'
</script>
```

## Use

Say we have the following file, `example.md`:

```markdown
# Alpha

## Table of contents

## Bravo

### Charlie

## Delta
```

And our module, `example.js`, looks as follows:

```js
import {read} from 'to-vfile'
import {remark} from 'remark'
import remarkToc from 'remark-toc'

main()

async function main() {
  const file = await remark()
    .use(remarkToc)
    .process(await read('example.md'))

  console.log(String(file))
}
```

Now, running `node example` yields:

```markdown
# Alpha

## Table of contents

*   [Bravo](#bravo)

    *   [Charlie](#charlie)

*   [Delta](#delta)

## Bravo

### Charlie

## Delta
```

## API

This package exports no identifiers.
The default export is `remarkToc`.

### `unified().use(remarkToc[, options])`

Generate a table of contents.
Looks for a certain heading, removes everything between it and an equal or
higher heading, and replaces that with a list representing the document
structure, linking to all further headings.

##### `options`

Configuration (optional).

##### `options.heading`

Pattern text of heading to look for (`string`, default:
`'toc|table[ -]of[ -]contents?'`).
Wrapped in `new RegExp('^(' + options.heading + ')$', 'i')`, so it’s
case-insensitive and matches the whole heading text.

##### `options.skip`

Pattern text of headings to exclude from the generated list (`string`,
optional).
Wrapped in `new RegExp('^(' + options.skip + ')$', 'i')`, so it’s
case-insensitive and matches whole heading texts.

###### `options.maxDepth`

Maximum heading depth to include in the generated list (`number?`, default:
`6`).
This is inclusive: when set to `3`, headings with a rank of 3 are included
(those with three hashes: `###`).

###### `options.tight`

Whether to compile list items tightly (`boolean?`, default: `false`).
The default is to add space around items.

###### `options.ordered`

Whether to compile list items as an ordered list (`boolean?`, default: `false`).
The default is to use an unordered list.

###### `options.prefix`

String to prepend before links to headings (`string?`, default: `null`, example:
`'user-content-'`).
This is useful when combining remark with [rehype][] through
[`remark-rehype`][remark-rehype] after this plugin, and using
[`rehype-sanitize`][rehype-sanitize] to prevent DOM clobbering of user generated
markdown.

###### `options.parents`

Parents (such as block quotes and lists) of headings to include in the generated
list ([`is`-compatible][is] test, default: the root node).
By default only top level headings are used.
Pass `['root', 'blockquote']` to also link to headings in block quotes.

## Examples

### Example: a different heading

The option `heading` can be set to search for a different heading.
The example from before can be changed to search for different headings like so:

```diff
@@ -6,7 +6,7 @@ main()

 async function main() {
   const file = await remark()
-    .use(remarkToc)
+    .use(remarkToc, {heading: 'contents'})
     .process(await read('example.md'))

   console.log(String(file))
```

…that would search for `Contents` (case-insensitive) headings.

### Example: ordered, tight list

The options `ordered` and `tight` can be turned on to change the list.
The example from before can be changed to generate a tight, ordered list like
so:

```diff
@@ -6,7 +6,10 @@ main()

 async function main() {
   const file = await remark()
-    .use(remarkToc)
+    .use(remarkToc, {tight: true, ordered: true})
     .process(await read('example.md'))

   console.log(String(file))
```

…that would generate the following list:

```markdown
1.  [Bravo](#bravo)
    1.  [Charlie](#charlie)
2.  [Delta](#delta)
```

### Example: including and excluding headings

The options `maxDepth`, `skip`, and `parents` can be used to include and exclude
certain headings from list.
The example from before can be changed to generate a tight, ordered list like
so:

```diff
@@ -6,7 +6,10 @@ main()

 async function main() {
   const file = await remark()
-    .use(remarkToc)
+    .use(remarkToc, {maxDepth: 3, skip: 'delta', parents: ['root', 'listItem']})
     .process(await read('example.md'))

   console.log(String(file))
```

…that would exclude level 4, 5, and 6 headings, exclude headings of `delta`
(case-insensitive, full match), and include headings directly in a list item.

### Example: adding a prefix

The option `prefix` can set to prepend a string to all links to headings in the
generated list:

```diff
@@ -6,7 +6,10 @@ main()

 async function main() {
   const file = await remark()
-    .use(remarkToc)
+    .use(remarkToc, {prefix: 'user-content-'})
     .process(await read('example.md'))

   console.log(String(file))
```

…that would generate the following list:

```markdown
*   [Bravo](#user-content-bravo)

    *   [Charlie](#user-content-charlie)

*   [Delta](#user-content-delta)
```

## Types

This package is fully typed with [TypeScript][].
It exports an `Options` type, which specifies the interface of the accepted
options.

## Compatibility

Projects maintained by the unified collective are compatible with all maintained
versions of Node.js.
As of now, that is Node.js 12.20+, 14.14+, and 16.0+.
Our projects sometimes work with older versions, but this is not guaranteed.

This plugin works with `unified` version 3+ and `remark` version 4+.

## Security

Use of `remark-toc` involves user content and changes the tree, so it can open
you up for a [cross-site scripting (XSS)][xss] attack.

Existing nodes are copied into the table of contents.
The following example shows how an existing script is copied into the table of
contents.

The following markdown:

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

This may become a problem if the markdown is later transformed to
[**rehype**][rehype] ([**hast**][hast]) or opened in an unsafe markdown viewer.

## Related

*   [`remark-normalize-headings`](https://github.com/remarkjs/remark-normalize-headings)
    — make sure that there is only one top-level heading by normalizing heading
    ranks
*   [`remark-collapse`](https://github.com/Rokt33r/remark-collapse)
    – make some sections collapsible
*   [`remark-contributors`](https://github.com/remarkjs/remark-contributors)
    – generate a contributors section
*   [`remark-license`](https://github.com/remarkjs/remark-license)
    – generate a license section
*   [`remark-package-dependencies`](https://github.com/unlight/remark-package-dependencies)
    – generate a dependencies section
*   [`remark-usage`](https://github.com/remarkjs/remark-usage)
    – generate a usage section

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

[skypack]: https://www.skypack.dev

[health]: https://github.com/remarkjs/.github

[contributing]: https://github.com/remarkjs/.github/blob/HEAD/contributing.md

[support]: https://github.com/remarkjs/.github/blob/HEAD/support.md

[coc]: https://github.com/remarkjs/.github/blob/HEAD/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[remark]: https://github.com/remarkjs/remark

[unified]: https://github.com/unifiedjs/unified

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting

[typescript]: https://www.typescriptlang.org

[rehype]: https://github.com/rehypejs/rehype

[hast]: https://github.com/syntax-tree/hast

[remark-rehype]: https://github.com/remarkjs/remark-rehype

[rehype-slug]: https://github.com/rehypejs/rehype-slug

[rehype-autolink-headings]: https://github.com/rehypejs/rehype-autolink-headings

[rehype-sanitize]: https://github.com/rehypejs/rehype-sanitize

[mdast-util-toc]: https://github.com/syntax-tree/mdast-util-toc

[create-a-plugin]: https://unifiedjs.com/learn/guide/create-a-plugin/

[is]: https://github.com/syntax-tree/unist-util-is#api
