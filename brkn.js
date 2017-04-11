const x        = require('x-ray')(),
      chalk    = require('chalk'),
      urllib   = require('url'),
      request  = require('request-promise'),
      validUrl = require('valid-url');

const pkg = require('./package.json');

function brkn(url, attributes, verbose) {
  return new Promise((resolve, reject) => {
    if (url && validUrl.isUri(url)) {
      let cachedUrls = [];
      let brokenUrls = [];
      let total = 0;
      let count = 0;

      if (!attributes) {
        reject({
          status: 'ERR',
          message: 'Missing required argument: --attr'
        });
      }

      attributes.forEach(attr => {
        x(url, ['*@' + attr])((xerr, values) => {
          if (xerr) {
            return reject({
              status: 'ERR',
              message: xerr
            });
          }

          values = values
          // Filter undefined values
          .filter(value => {
            return value !== undefined;
          })
          // Filter URIs
          .filter(value => {
            return (/^[a-z0-9-\.]+:/i.test(value)
                   && /^(?!https?:)/i.test(value)) === false;
          })
          // Resolve URLs
          .map(value => {
            return urllib.resolve(url, value);
          });

          values.forEach(value => {
            if (value === url.concat('/') || cachedUrls.includes(value)) {
              return;
            }

            cachedUrls.push(value);
            total++;

            request({
              uri: value,
              headers: {
                'User-Agent': 'brkn/' + pkg.version + ' (' + pkg.homepage + ')'
              },
              resolveWithFullResponse: true
            })
            .then(res => {
              if (verbose) {
                console.log(
                  chalk.bgBlue(attr.toUpperCase()),
                  value,
                  chalk.green(res.statusCode)
                );
              }
            })
            .catch(rerr => {
              if (verbose) {
                console.log(
                  chalk.bgBlue(attr.toUpperCase()),
                  chalk.red(value),
                  chalk.red(rerr.statusCode)
                );
              }
              brokenUrls.push(value);
            })
            .finally(() => {
              if (count < total - 1) {
                count++;
              } else {
                return resolve(brokenUrls);
              }
            });
          });
        });
      });
    } else {
      return reject({
        status: 'ERR',
        message: 'Missing or invalid argument: url'
      });
    }
  });
}

module.exports = {
  brkn: brkn
}
