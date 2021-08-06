import {toc} from 'mdast-util-toc'

export default function remarkToc(options = {}) {
  return (node) => {
    const result = toc(
      node,
      Object.assign({}, options, {
        heading: options.heading || 'toc|table[ -]of[ -]contents?'
      })
    )

    if (result.index === null || result.index === -1 || !result.map) {
      return
    }

    node.children = [
      ...node.children.slice(0, result.index),
      result.map,
      ...node.children.slice(result.endIndex)
    ]
  }
}
