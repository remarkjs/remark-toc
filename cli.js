#!/usr/bin/env node
'use strict';

/*
 * Dependencies.
 */

var spawn,
    pack;

spawn = require('win-fork');
pack = require('./package.json');

/*
 * Resolve.
 */

var mdast,
    toc;

mdast = require.resolve('mdast/cli.js');
toc = require.resolve('./index.js');

/*
 * Arguments.
 */

var argv;

argv = process.argv.slice(2);

/*
 * Command.
 */

var command;

command = Object.keys(pack.bin)[0];

/*
 * Program.
 */

if (argv[0] === '--version' || argv[0] === '-v') {
    /*
     * Version.
     */

    console.log(pack.version);
} else if (argv[0] === '--help' || argv[0] === '-h') {
    /*
     * Help.
     */

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
        '$ cat Docs.md | ' + command + ' --option setext > Docs-new.md',
        '',
        '# Use other plugins',
        '$ npm install mdast-usage',
        '$ ' + command + ' --use mdast-usage Readme.md'
    ].join('\n  ') + '\n');
} else {
    /*
     * Spawn.
     */

    var proc;

    proc = spawn(mdast, ['--use', toc].concat(argv), {
        'stdio': 'inherit'
    });

    /*
     * Exit.
     */

    proc.on('exit', function (code) {
        process.exit(code);
    });
}
