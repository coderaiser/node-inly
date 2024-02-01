'use strict';

const tryCatch = require('try-catch');
const {once} = require('events');
const {tmpdir} = require('os');
const {sep} = require('path');
const {mkdtempSync} = require('fs');

const test = require('supertape');
const inly = require('..');

const tmp = () => mkdtempSync(tmpdir() + sep);

test('inly: extract: no args', (t) => {
    const [error] = tryCatch(inly);
    
    t.equal(error.message, 'from should be a string!', 'should throw when no args');
    t.end();
});

test('inly: extract: to', (t) => {
    const [error] = tryCatch(inly, 'hello');
    
    t.equal(error.message, 'to should be a string!', 'should throw when no to');
    t.end();
});

test('inly: extract: error: file not found', async (t) => {
    const expect = `ENOENT: no such file or directory, open 'hello.zip'`;
    const extracter = inly('hello.zip', 'hello');
    const [e] = await once(extracter, 'error');
    
    t.equal(e.message, expect, 'should emit error when file not found');
    t.end();
});

test('inly: extract: error: wrong file type', async (t) => {
    const expect = 'Not supported archive type: ".js"';
    const extracter = inly(__filename, tmp());
    
    const [{message}] = await once(extracter, 'error');
    
    t.equal(message, expect, 'should emit error when can not extract');
    t.end();
});
