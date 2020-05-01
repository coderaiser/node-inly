'use strict';

const {once} = require('events');
const {tmpdir} = require('os');
const {
    sep,
    join,
} = require('path');
const {
    readFileSync,
    unlinkSync,
    rmdirSync,
    mkdtempSync,
} = require('fs');

const test = require('supertape');
const inly = require('..');

const fixture = join(__dirname, 'fixture');

test('inly: extract: zip', async (t) => {
    const to = mkdtempSync(tmpdir() + sep);
    const from = join(fixture, 'fixture.zip');
    const extracter = inly(from, to);
    
    await once(extracter, 'end');
    
    const pathUnpacked = join(to, 'fixture.txt');
    const pathFixture = join(fixture, 'fixture.txt');
    const fileUnpacked = readFileSync(pathUnpacked);
    const fileFixture = readFileSync(pathFixture);
    
    unlinkSync(pathUnpacked);
    rmdirSync(to);
    
    t.deepEqual(fileFixture, fileUnpacked, 'should extract file');
    t.end();
});

test('inly: extract: zip: empty: error', async (t) => {
    const error = 'end of central directory record signature not found';
    const from = join(fixture, 'empty.zip');
    const extracter = inly(from, 'hello');
    const [e] = await once(extracter, 'error');
    
    t.deepEqual(e.message, error, 'should extract file');
    t.end();
});

