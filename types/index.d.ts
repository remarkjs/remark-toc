// Minimum TypeScript Version: 3.2

import {Node} from 'unist'
import {Plugin, Transformer}	from 'unified'
import {Heading} from 'mdast'
import {TOCOptions} from 'mdast-util-toc'

declare namespace remarkToc {
  interface TOCSettings {
    /**
     * Heading to look for, wrapped in `new RegExp('^(' + value + ')$', 'i')`.
     *
     * @default `'toc|table[ -]of[ -]contents?'`
     */
    heading?: TOCOptions['heading']

    /**
     * Maximum heading depth to include in the table of contents,
     * This is inclusive, thus, when set to `3`, level three headings,
     * are included (those with three hashes, `###`).
     *
     * @default 6
     */
    maxDepth?: TOCOptions['maxDepth']

    /**
     * Whether to compile list-items tightly.
     *
     * @default false
     */
    tight?: TOCOptions['tight']

    /**
     *  Headings to skip, wrapped in `new RegExp('^(' + value + ')$', 'i')`.
     *  Any heading matching this expression will not be present in the table of contents.
     */
    skip?: TOCOptions['skip']
  }
}

declare function remarkToc(
  settings?: remarkToc.TOCSettings
): (node: Node) => void

export = remarkToc
