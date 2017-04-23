'use strict';

const rp         = require('request-promise'),
      isWebUri   = require('valid-url').isWebUri,
      fsReadFile = require('fs').readFile;

const packageJSON = require('../package.json');

module.exports = function(target) {
  return new Promise((resolve, reject) => {
    if(isWebUri(target)) {
      rp({
        uri: target,
        method: 'get',
        headers: {
          'User-Agent': `${packageJSON.name}/${packageJSON.version} (${packageJSON.homepage})`
        }
      }).then(content => {
        return resolve({
          type: 'URI',
          payload: content
        });
      }).catch(error => {
        return reject({
          type: 'URI',
          payload: error.message
        });
      });
    } else {
      fsReadFile(target, 'utf8', (error, content) => {
        if (error) {
          return reject({
            type: 'FILE',
            payload: error.message,
          });
        }

        return resolve({
          type: 'FILE',
          payload: content
        });
      });
    }
  });
}
