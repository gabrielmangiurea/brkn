# brkn [![Build Status](https://travis-ci.org/GabrielMangiurea/brkn.svg?branch=master)](https://travis-ci.org/GabrielMangiurea/brkn)

> Yet another broken link checker.


## Install

```
$ npm install --save brkn
```


## Usage

```javascript
const brkn = require('brkn');
const ee   = require('brkn/event_emitter');

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

Emits an `end` event with the inaccessible URLs found in `sources`.

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
  - type: `object`
  - params:
    - broken: `boolean`
    - source: `string`
    - statusCode: `integer`
    - url: `string`
- `source`
  - emitted: after each completed source, when there are more than one
  - type: `object`
  - params:
    - source: `string`
    - brokenUrls: `array`


## License
MIT &copy; [Gabriel Mangiurea](https://gabrielmangiurea.github.io)
