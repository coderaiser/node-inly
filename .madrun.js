'use strict';

const {run} = require('madrun');

module.exports = {
    'lint': () => 'putout bin lib test',
    'fix:lint': () => run('lint', '--fix'),
    'test': () => 'tape \'test/**/*.js\'',
    'coverage': () => 'nyc npm test',
    'report': () => 'nyc report --reporter=text-lcov | coveralls',
    'watcher': () => 'nodemon -w test -w lib --exec',
    'watch:test': () => run('watcher', 'npm test'),
    'watch:coverage': () => run('watcher', 'npm run coverage'),
};

