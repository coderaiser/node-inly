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
const extract = require('..');
const fixture = join(__dirname, 'fixture');

test('tar: extract: error: file not found', async (t) => {
    const expect = `ENOENT: no such file or directory, open 'hello.tar.gz'`;
    const extracter = extract('hello.tar.gz', 'hello');
    const [e] = await once(extracter, 'error');
    
    t.equal(e.message, expect, 'should emit error when file not found');
    t.end();
});

test('tar: extract: error: tar', async (t) => {
    const expect = 'No entries found';
    const from = join(fixture, 'empty.tar');
    const extracter = extract(from, 'hello');
    const [e] = await once(extracter, 'error');
    
    t.equal(e.message, expect, 'should emit error when file not found');
    t.end();
});

test('tar: extract: gz', async (t) => {
    const to = mkdtempSync(tmpdir() + sep);
    const from = join(fixture, 'fixture.tar.gz');
    const extracter = extract(from, to);
    
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

test('tar: extract: bz2', async (t) => {
    const to = mkdtempSync(tmpdir() + sep);
    const from = join(fixture, 'fixture.tar.bz2');
    const extracter = extract(from, to);
    
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

test('tar: extract: tar', async (t) => {
    const to = mkdtempSync(tmpdir() + sep);
    const fixture = join(__dirname, 'fixture');
    const from = join(fixture, 'fixture.tar');
    const extracter = extract(from, to);
    
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
