'use strict';

const {tmpdir} = require('os');
const {sep} = require('path');
const {mkdtempSync} = require('fs');

const test = require('supertape');
const inly = require('..');

const tmp = () => mkdtempSync(tmpdir() + sep);

test('inly: extract: no args', (t) => {
    t.throws(inly, /from should be a string!/, 'should throw when no args');
    t.end();
});

test('inly: extract: to', (t) => {
    const fn = () => inly('hello');
    t.throws(fn, /to should be a string!/, 'should throw when no to');
    t.end();
});

test('inly: extract: error: file not found', (t) => {
    const expect = 'ENOENT: no such file or directory, open \'hello.zip\'';
    const extracter = inly('hello.zip', 'hello');
    
    extracter.on('error', (e) => {
        t.equal(e.message, expect, 'should emit error when file not found');
        t.end();
    });
});

test('inly: extract: error: wrong file type', (t) => {
    const expect = 'Not supported archive type: ".js"';
    const extracter = inly(__filename, tmp());
    
    extracter.on('error', ({message}) => {
        t.equal(message, expect, 'should emit error when can not extract');
        t.end();
    });
});

