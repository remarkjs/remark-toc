// Minimum TypeScript Version: 3.2

import {Node} from 'unist'
import {Plugin, Transformer}	from 'unified'
import {Heading} from 'mdast'
import {TOCOptions} from 'mdast-util-toc'

declare namespace remarkToc {
  type TOCSettings = Pick<TOCOptions, 'heading' | 'maxDepth' | 'tight' | 'skip'>;
}

declare function remarkToc(
  settings?: remarkToc.TOCSettings
): (node: Node) => void

export = remarkToc
