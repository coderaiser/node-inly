'use strict';

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const util = require('util');
const {EventEmitter} = require('events');

const pipe = require('pipe-io');
const through = require('through2');

util.inherits(Gzip, EventEmitter);

module.exports = (from, to) => {
    const emitter = new Gzip(from, to);
    
    process.nextTick(() => {
        emitter._start();
    });
    
    return emitter;
};

function Gzip(from, to) {
    EventEmitter.call(this);
    
    const name = path.basename(from.replace(/\.gz/, ''));
    
    this._from = from;
    this._to = path.join(to, name);
    this._i = 0;
    this._n = 0;
    this._percent = 0;
    this._percentPrev = 0;
}

Gzip.prototype._start = function() {
    const from = this._from;
    const to = this._to;
    
    fs.stat(from, (e, stat) => {
        if (e)
            return this.emit('error', e);
        
        if (!stat.size)
            return this.emit('error', Error('archive is empty'));
        
        this._n = stat.size;
        
        const unzipStream  = zlib.createGunzip();
        const readStream = fs.createReadStream(from);
        const writeStream = fs.createWriteStream(to);
        const progressStream = this.getProgressStream();
        
        pipe([
            readStream,
            progressStream,
            unzipStream,
            writeStream
        ], (e) => {
            if (e)
                return this.emit('error', e);
            
            this.emit('file', path.basename(to));
            this.emit('end');
        });
    });
};

Gzip.prototype.getProgressStream = function() {
    return through((chunk, enc, callback) => {
        this._i += chunk.length;
        this._progress();
        callback(null, chunk);
    });
};

Gzip.prototype._progress = function() {
    const value = Math.round(this._i * 100 / this._n);
    
    this._percent = value;
    
    if (value !== this._percentPrev) {
        this._percentPrev = value;
        this.emit('progress', value);
    }
};

