import util from 'mdast-util-toc'

export default function remarkToc(options = {}) {
  return transformer

  function transformer(node) {
    var result = util(
      node,
      Object.assign({}, options, {
        heading: options.heading || 'toc|table[ -]of[ -]contents?'
      })
    )

    if (result.index === null || result.index === -1 || !result.map) {
      return
    }

    node.children = [].concat(
      node.children.slice(0, result.index),
      result.map,
      node.children.slice(result.endIndex)
    )
  }
}
