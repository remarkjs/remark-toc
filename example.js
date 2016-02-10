// Dependencies:
var remark = require('remark');
var toc = require('./index.js');

// Process:
var doc = remark().use(toc).process([
    '# Alpha',
    '',
    '## Table of Contents',
    '',
    '## Bravo',
    '',
    '### Charlie',
    '',
    '## Delta',
    ''
].join('\n'));

// Yields:
console.log('markdown', doc);
