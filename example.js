// Require/read dependencies:
var toc = require('./index.js');
var fs = require('fs');
var mdast = require('mdast').use(toc);
var readme = fs.readFileSync('Readme.md', 'utf-8');

// Parse markdown (this TOC is the 14th child).
var contents = mdast.parse(readme).children[14];

// Stringify:
var doc = mdast.stringify(contents);

// Yields:
console.log('markdown', doc);
