'use strict';

const fs = require('fs');
const path = require('path');
const bzip2 = require('unbzip2-stream');
const {inherits, promisify}= require('util');
const {EventEmitter} = require('events');

const pipe = require('pipe-io');
const through = require('through2');
const tryToCatch = require('try-to-catch');

const stat = promisify(fs.stat);
inherits(Bzip2, EventEmitter);

module.exports = (from, to) => {
    const emitter = new Bzip2(from, to);
    
    process.nextTick(() => {
        emitter._start();
    });
    
    return emitter;
};

function Bzip2(from, to) {
    const name = path.basename(from.replace(/\.bz2/, ''));
    
    this._from = from;
    this._to = path.join(to, name);
    this._i = 0;
    this._n = 0;
    this._percent = 0;
    this._percentPrev = 0;
}

Bzip2.prototype._start = async function() {
    const from = this._from;
    const to = this._to;
    
    const [statError, statData] = await tryToCatch(stat, from);
    
    if (statError)
        return this.emit('error', statError);
    
    if (!statData.size)
        return this.emit('error', Error('archive is empty'));
    
    this._n = statData.size;
    
    const unbzip2Stream  = bzip2();
    const readStream = fs.createReadStream(from);
    const writeStream = fs.createWriteStream(to);
    const progressStream = this.getProgressStream();
    
    const [e] = await tryToCatch(pipe, [
        readStream,
        progressStream,
        unbzip2Stream,
        writeStream
    ]);
    
    if (e)
        return this.emit('error', e);
    
    this.emit('file', path.basename(to));
    this.emit('end');
};

Bzip2.prototype.getProgressStream = function() {
    return through((chunk, enc, callback) => {
        this._i += chunk.length;
        this._progress();
        callback(null, chunk);
    });
};

Bzip2.prototype._progress = function() {
    const value = Math.round(this._i * 100 / this._n);
    
    this._percent = value;
    
    if (value !== this._percentPrev) {
        this._percentPrev = value;
        this.emit('progress', value);
    }
};

