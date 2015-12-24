// Require/read dependencies:
var toc = require('./index.js');
var fs = require('fs');
var remark = require('remark').use(toc);
var readme = fs.readFileSync('readme.md', 'utf-8');

// Parse markdown (this TOC is the 14th child).
var contents = remark.run(remark.parse(readme)).children[14];

// Stringify:
var doc = remark.stringify(contents);

// Yields:
console.log('markdown', doc);
