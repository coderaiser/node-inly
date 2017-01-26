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

test('inly: extract: zip', (t) => {
    const to = mkdtempSync(tmpdir() + sep);
    const from = join(fixture, 'fixture.zip');
    const extracter = inly(from, to);
    
    extracter.on('end', () => {
        const pathUnpacked = join(to, 'fixture.txt');
        const pathFixture= join(fixture, 'fixture.txt');
        
        const fileUnpacked = readFileSync(pathUnpacked);
        const fileFixture = readFileSync(pathFixture);
        
        unlinkSync(pathUnpacked);
        rmdirSync(to);
        
        t.deepEqual(fileFixture, fileUnpacked, 'should extract file');
        t.end();
    });
});

test('inly: extract: zip: empty: error', (t) => {
    const error = 'end of central directory record signature not found';
    const from = join(fixture, 'empty.zip');
    const extracter = inly(from, 'hello');
    
    extracter.on('error', (e) => {
        t.deepEqual(e.message, error, 'should extract file');
        t.end();
    });
});

