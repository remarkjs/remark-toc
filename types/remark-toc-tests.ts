import remark = require('remark')

import toc = require('remark-toc')

remark().use(toc)

remark().use(toc, {})

remark().use(toc, {
  heading: 'heading'
})

remark().use(toc, {
  maxDepth: 2
})

remark().use(toc, {
  tight: true
})

remark().use(toc, {
  skip: 'skip-heading'
})

remark().use(toc, {
  prefix: 'prefix-'
})

remark().use(toc, {
  parents: ['root', 'blockquote']
})
