'use strict';

const path = require('path');
const util = require('util');
const onezip = require('onezip');
const jaguar = require('jaguar');
const bizzy = require('bizzy');
const gzip = require('./gzip');
const bzip2 = require('./bzip2');
const {EventEmitter} = require('events');

util.inherits(Inly, EventEmitter);

module.exports = (from, to) => {
    check(from, to);
    const emitter = new Inly(from, to);
    
    process.nextTick(() => {
        emitter._start();
    });
    
    return emitter;
};

function check(from, to) {
    if (typeof from !== 'string')
        throw Error('from should be a string!');
    
    if (typeof to !== 'string')
        throw Error('to should be a string!');
}

function Inly(from, to) {
    this._from = from;
    this._to = to;
    
    EventEmitter.call(this);
}

function getExtractor(name) {
    if (/\.zip/.test(name))
        return onezip.extract;
    
    if (/\.(tar\.gz|tgz|tar)$/.test(name))
        return jaguar.extract;
    
    if (/\.(tar\.bz2|tbz2|tar)$/.test(name))
        return bizzy;
    
    if (/\.gz/.test(name))
        return gzip;
    
    if (/\.bz2/.test(name))
        return bzip2;
}

Inly.prototype._start = function() {
    const from = this._from;
    const to = this._to;
    const ext = path.extname(from);
    const error = Error(`Not supported archive type: "${ext}"`);
    const extractor = getExtractor(from);
    
    if (!extractor)
        return this.emit('error', error);
    
    extractor(from, to)
        .on('error', (e) => {
            this.emit('error', e);
        })
        .on('progress', (n) => {
            this.emit('progress', n);
        })
        .on('file', (file) => {
            this.emit('file', file);
        })
        .on('end', () => {
            this.emit('end');
        });
};

