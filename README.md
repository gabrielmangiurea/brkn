# brkn [![Build Status](https://travis-ci.org/GabrielMangiurea/brkn.svg?branch=master)](https://travis-ci.org/GabrielMangiurea/brkn)

> Yet another broken link checker.


## Install

```
$ npm install --save brkn
```


## Usage

```javascript
const brkn = require('brkn');
const ee   = require('brkn/event-emitter');

// execute the function
brkn(['https://your.website.here/somepage.html'], ['href'], 'https://your.website.here', {verbose: false});

// then listen for the 'end' event
ee.on('end', function(brokenUrls) {
  console.log('Broken URLs:', brokenUrls);
  //=> 'Broken URLs: [...]'
});
```


## API

### brkn(sources, attributes, baseUrl, [opts])

Emits an `end` event (type: `Array`) with the inaccessible URLs found in `sources`.

Will emit `error` event (type: `String`) on URL/File parsing errors.

#### sources

Type: `Array`

An array with the target web page(s) or file(s).

#### attributes

Type: `Array`

An array with the HTML attributes that **brkn** should scan.

#### base

Type: `String`

The hostname (with protocol) to which the relative URLs will resolve to.

#### options

##### verbose

Type: `Boolean`

If true, **brkn** will emit two additional events:

- `item`
  - emitted: after each scanned URL
  - type: `Object`
  - params:
    - broken: `Boolean`
    - source: `String`
    - statusCode: `Integer`
    - url: `String`
- `source`
  - emitted: after each completed source, when there are more than one
  - type: `Object`
  - params:
    - source: `String`
    - brokenUrls: `Array`


## Related

- [brkn-cli](https://www.npmjs.com/package/brkn-cli) - CLI for this module


## License

MIT &copy; [Gabriel Mangiurea](https://gabrielmangiurea.github.io)
