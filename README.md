# Inly [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Dependency Status][DependencyStatusIMGURL]][DependencyStatusURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL] [![Coverage Status][CoverageIMGURL]][CoverageURL]

Extract .zip, .gz, .bz2, .tar, tar.gz, tar.bz2, .tgz, .tbz2 archives with emitter.

## Global

`inly` could be installed global with

```
npm i inly -g
```
And used this way:

```
Usage: inly [filename]
Options:
  -h, --help      display this help and exit
  -v, --version   output version information and exit
```

## Local

`inly` could be used localy. It will emit event on every packed/extracted file.
Good for making progress bars.

## Install

```
npm i inly --save
```

## How to use?

### inly(from, to)

- `from` - path to archive
- `to` - path to directory where files would be stored.

```js
const inly = require('inly');
const path = require('path');
const cwd = process.cwd();
const name = 'pipe.zip';
const to = cwd + '/pipe-io';
const from = path.join(cwd, name);

const extract = inly(from, to);

extract.on('file', (name) => {
    console.log(name);
});

extract.on('progress', (percent) => {
    console.log(percent + '%');
});

extract.on('error', (error) => {
    console.error(error);
});

extract.on('end', () => {
    console.log('done');
});
```

In case of starting example output should be similar to (but with additional events):

```
33%
67%
100%
done
```

## Related

- [OneZip](https://github.com/coderaiser/node-onezip "OneZip") - Pack and extract .zip archives with emitter.
- [Bizzy](https://github.com/coderaiser/node-bizzy "Bizzy") - Pack and extract .tar.bz2 archives with emitter.
- [Jaguar](https://github.com/coderaiser/node-jaguar "Jaguar") - Pack and extract .tar.gz archives with emitter.
- [Jag](https://github.com/coderaiser/node-jag "Jag") - Pack files and folders with tar and gzip.
- [Tar-to-zip](https://github.com/coderaiser/node-tar-to-zip "Tar-to-zip") - Convert tar and tar.gz archives to zip.
- [Copymitter](https://github.com/coderaiser/node-copymitter "Copymitter") - Copy files with emitter.
- [Remy](https://github.com/coderaiser/node-remy "Remy") - Remove files with emitter.

## License

MIT

[NPMIMGURL]:                https://img.shields.io/npm/v/inly.svg?style=flat
[BuildStatusIMGURL]:        https://img.shields.io/travis/coderaiser/node-inly/master.svg?style=flat
[DependencyStatusIMGURL]:   https://img.shields.io/david/coderaiser/node-inly.svg?style=flat
[LicenseIMGURL]:            https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat
[NPMURL]:                   https://npmjs.org/package/inly "npm"
[BuildStatusURL]:           https://travis-ci.org/coderaiser/node-inly  "Build Status"
[DependencyStatusURL]:      https://david-dm.org/coderaiser/node-inly "Dependency Status"
[LicenseURL]:               https://tldrlegal.com/license/mit-license "MIT License"

[CoverageURL]:              https://coveralls.io/github/coderaiser/node-inly?branch=master
[CoverageIMGURL]:           https://coveralls.io/repos/coderaiser/node-inly/badge.svg?branch=master&service=github

