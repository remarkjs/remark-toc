// Minimum TypeScript Version: 3.2

import {Node} from 'unist'
import {TOCOptions} from 'mdast-util-toc'

declare namespace remarkToc {
  type TOCSettings = TOCOptions
}

/**
 * Generate a Table of Contents.
 *
 * @param  settings configuration for generating the table of contents
 */
declare function remarkToc(
  settings?: remarkToc.TOCSettings
): (node: Node) => void

export = remarkToc
