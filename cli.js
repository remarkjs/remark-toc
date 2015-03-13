#!/usr/bin/env node
'use strict';

/*
 * Dependencies.
 */

var spawn = require('win-fork');
var pack = require('./package.json');

/*
 * Resolve.
 */

var mdast = require.resolve('mdast/cli.js');
var toc = require.resolve('./index.js');

/*
 * Arguments.
 */

var argv = process.argv.slice(2);

/*
 * Command.
 */

var command = Object.keys(pack.bin)[0];

/*
 * Program.
 */

if (argv[0] === '--version' || argv[0] === '-v') {
    console.log(pack.version);
} else if (argv[0] === '--help' || argv[0] === '-h') {
    console.log([
        '',
        'Usage: ' + command + ' [mdast options]',
        '',
        pack.description,
        '',
        'Options:',
        '',
        '  -h, --help            output usage information',
        '  -v, --version         output version number',
        '',
        'A wrapper around `mdast --use ' + command + '`',
        '',
        'Help for mdast:',
        '',
        '  https://github.com/wooorm/mdast',
        '',
        'Usage:',
        '',
        '# Pass `Readme.md` through ' + command,
        '$ ' + command + ' Readme.md -o Readme.md',
        '',
        '# Pass stdin through ' + command + ', with mdast options, ' +
            'and write to stdout',
        '$ cat Docs.md | ' + command + ' --setting setext > Docs-new.md',
        '',
        '# Use other plugins',
        '$ npm install mdast-usage',
        '$ ' + command + ' --use mdast-usage Readme.md'
    ].join('\n  ') + '\n');
} else {
    var proc = spawn(mdast, ['--use', toc].concat(argv), {
        'stdio': 'inherit'
    });

    /*
     * Exit.
     */

    proc.on('exit', function (code) {
        process.exit(code);
    });
}
