'use strict';

const urlResolve = require('url').resolve;

const parseSource       = require('./lib/parse_source'),
      eventEmitter      = require('./event_emitter'),
      requestResource   = require('./lib/request_resource'),
      extractAttributes = require('./lib/extract_attributes');

module.exports = function(sources, attributes, baseUrl, opts) {
  // init
  let counter = {
    global: {
      current: 0,
      total: 0
    },
    // object of sources counters
    source: {}
  };

  let brokenUrls = [];
  let cachedUrls = [];

  // arguments validations
  if(!Array.isArray(sources) || sources.length < 1) {
    throw new Error('Sources argument must be an array with at least 1 element');
  }

  if(!baseUrl) {
    throw new Error('Base URL argument must be a valid URL');
  }

  if(typeof opts !== 'object') {
    throw new Error('Options argument must be of object type');
  }

  for(let source of sources) {
    parseSource(source).then(parsed => {
      // reset the source counter for each source
      counter.source[source] = {};
      counter.source[source].current = 0;
      counter.source[source].total   = 0;

      // initialize the brokenUrl and cachedUrls arrays for each source
      brokenUrls[source] = [];
      cachedUrls[source] = [];

      let attrs = extractAttributes(parsed.payload, attributes, urlResolve(baseUrl, '/'));

      for(let attr in attrs) {
        for(let url of attrs[attr]) {
          if(url === urlResolve(baseUrl, '/') || cachedUrls[source].includes(url)) {
            continue;
          }

          ++counter.global.total;
          ++counter.source[source].total;
          cachedUrls[source].push(url);

          requestResource(url)
          .then(goodUrl => {
            if(opts && opts.verbose) {
              eventEmitter.emit('item', {
                broken: false,
                source: sources.length > 1 ? source : null,
                statusCode: goodUrl.statusCode,
                url
              });
            }
          }).catch(badUrl => {
            if(opts && opts.verbose) {
              eventEmitter.emit('item', {
                broken: true,
                source: sources.length > 1 ? source : null,
                statusCode: badUrl.statusCode,
                url
              });
            }

            brokenUrls[source].push(url);
          }).then(() => {
            if(sources.length > 1 && (++counter.source[source].current >= counter.source[source].total)) {
              if(opts && opts.verbose) {
                eventEmitter.emit('source', {
                  source,
                  brokenUrls: brokenUrls[source]
                });
              }
            }

            if(++counter.global.current >= counter.global.total) {
              // brokenUrls is an array of objects
              // with the keys being each of the sources
              // and the values being every broken url for that source
              // we only need the values for all the keys in this case
              let broken = [];

              for(let item in brokenUrls) {
                for(let each of brokenUrls[item]) {
                  broken.push(each);
                }
              }

              eventEmitter.emit('end', broken);
            }
          })
        }
      }
    }).catch(parsingError => {
      eventEmitter.emit('error', parsingError);
    });
  }
}
