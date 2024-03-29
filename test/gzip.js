'use strict';

const {once} = require('events');
const {tmpdir} = require('os');
const {sep, join} = require('path');

const {
    readFileSync,
    unlinkSync,
    rmdirSync,
    mkdtempSync,
} = require('fs');

const test = require('supertape');
const inly = require('..');

const fixture = join(__dirname, 'fixture');

test('inly: extract: gzip', async (t) => {
    const to = mkdtempSync(tmpdir() + sep);
    const from = join(fixture, 'fixture.txt.gz');
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

test('inly: extract: gzip: error: empty', async (t) => {
    const error = 'archive is empty';
    const from = join(fixture, 'empty.gz');
    const extracter = inly(from, 'ss');
    const [e] = await once(extracter, 'error');
    
    t.equal(e.message, error, 'should extract file');
    t.end();
});

test('inly: extract: gzip: error: not found', async (t) => {
    const error = `ENOENT: no such file or directory, stat 'not-found.gz'`;
    const extracter = inly('not-found.gz', 'ss');
    const [e] = await once(extracter, 'error');
    
    t.equal(e.message, error, 'should extract file');
    t.end();
});

test('inly: extract: gzip: error: not found: gz', async (t) => {
    const error = `ENOENT: no such file or directory, stat 'not-found.gz'`;
    const extracter = inly('not-found.gz', 'ss');
    const [e] = await once(extracter, 'error');
    
    t.equal(e.message, error, 'should extract file');
    t.end();
});

test('inly: extract: gzip: error: EACCESS', async (t) => {
    const error = `ENOENT: no such file or directory, open 'not-found/fixture.txt'`;
    const from = join(fixture, 'fixture.txt.gz');
    const extracter = inly(from, 'not-found');
    const [e] = await once(extracter, 'error');
    
    t.equal(e.message, error, 'should extract file');
    t.end();
});
