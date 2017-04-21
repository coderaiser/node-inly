'use strict';

const {EventEmitter} = require('events');
const {tmpdir} = require('os');
const {
    sep,
    join
} = require('path');
const {
    readFileSync,
    unlinkSync,
    rmdirSync,
    mkdtempSync
} = require('fs');

const test = require('tape');
const inly = require('..');

const tmp = () => mkdtempSync(tmpdir() + sep);
const fixture = join(__dirname, 'fixture');

test('inly: extract: bz2', (t) => {
    const to = mkdtempSync(tmpdir() + sep);
    const from = join(fixture, 'fixture.txt.bz2');
    const extracter = inly(from, to);
    
    extracter.on('end', () => {
        const pathUnpacked = join(to, 'fixture.txt');
        const pathFixture = join(fixture, 'fixture.txt');
        
        const fileUnpacked = readFileSync(pathUnpacked);
        const fileFixture = readFileSync(pathFixture);
        
        unlinkSync(pathUnpacked);
        rmdirSync(to);
        
        t.deepEqual(fileUnpacked, fileFixture, 'should extract file');
        t.end();
    });
});

test('inly: extract: bz2: error: empty', (t) => {
    const error = 'archive is empty';
    const from = join(fixture, 'empty.bz2');
    const extracter = inly(from, 'ss');
    
    extracter.on('error', (e) => {
        t.deepEqual(e.message, error, 'should extract file');
        t.end();
    });
});

test('inly: extract: bz2: error: not found', (t) => {
    const error = 'ENOENT: no such file or directory, stat \'not-found.bz2\'';
    const extracter = inly('not-found.bz2', 'ss');
    
    extracter.on('error', (e) => {
        t.deepEqual(e.message, error, 'should extract file');
        t.end();
    });
});

test('inly: extract: bz2: error: not found', (t) => {
    const error = 'ENOENT: no such file or directory, stat \'not-found.bz2\'';
    const extracter = inly('not-found.bz2', 'ss');
    
    extracter.on('error', (e) => {
        t.deepEqual(e.message, error, 'should extract file');
        t.end();
    });
});

test('inly: extract: bz2: error: EACCESS', (t) => {
    const error = 'ENOENT: no such file or directory, open \'not-found/fixture.txt\'';
    const from = join(fixture, 'fixture.txt.bz2');
    const extracter = inly(from, 'not-found');
    
    extracter.on('error', (e) => {
        t.deepEqual(e.message, error, 'should extract file');
        t.end();
    });
});

