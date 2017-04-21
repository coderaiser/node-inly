#!/usr/bin/env node

'use strict';

const inly = require('..');
const glob = require('glob');
const argv = process.argv;

const args = require('yargs-parser')(argv.slice(2), {
    alias: {
        v: 'version',
        h: 'help',
    }
});

validate(args);

if (args.version)
    version();
else if (args.help)
    help();
else if (args._.length)
   getName(args._.pop(), extract);
else
    help();

function extract(file) {
    const cwd = process.cwd();
    const packer = inly(file, cwd);
    
    packer.on('error', (error) => {
        console.error(error.message);
    });
    
    packer.on('progress', (percent) => {
        process.stdout.write('\r' + percent + '%');
    });
    
    packer.on('end', () => {
        process.stdout.write('\n');
    });
}

function getName(str, fn) {
    glob(str, (error, files) => {
        if (error)
            return console.error(error.message);
        
        if (!files.length)
            return console.error('file not found');
        
        fn(files[0]);
    });
}

function version() {
    console.log('v' + info().version);
}

function info() {
    return require('../package');
}

function help() {
    const bin = require('../help');
    const usage = `Usage: ${info().name} [path]`;
    
    console.log(usage);
    console.log('Options:');
    
    Object.keys(bin).forEach((name) => {
        console.log(`  ${name} ${bin[name]}`);
    });
}

function validate(args) {
    const cmdReg = /^(_|v(ersion)?|h(elp)?)$/;
    
    Object.keys(args).forEach((cmd) => {
        if (!cmdReg.test(cmd)) {
            const name = info().name;
            console.error(`'${cmd}' is not a ${name} option. See '${name} --help'.`);
            process.exit(-1);
        }
    });
}

