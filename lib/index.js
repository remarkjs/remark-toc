/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast-util-toc').Options} Options
 */

import {toc} from 'mdast-util-toc'

/** @type {Readonly<Options>} */
const emptyOptions = {}

/**
 * Generate a table of contents (TOC).
 *
 * @param {Readonly<Options> | null | undefined} [options]
 *   Configuration (optional).
 * @returns
 *   Transform.
 */
export default function remarkToc(options) {
  let settings = options || emptyOptions

  if (!settings.heading) {
    settings = {...settings, heading: 'toc|table[ -]of[ -]contents?'}
  }

  /**
   * Transform.
   *
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree) {
    const result = toc(tree, settings)

    if (
      result.endIndex === undefined ||
      result.endIndex === -1 ||
      result.index === undefined ||
      result.index === -1 ||
      !result.map
    ) {
      return
    }

    tree.children = [
      ...tree.children.slice(0, result.index),
      result.map,
      ...tree.children.slice(result.endIndex)
    ]
  }
}
