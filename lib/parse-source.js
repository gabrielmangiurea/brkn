'use strict';

const fsReadFile = require('fs').readFile;
const rp = require('request-promise');
const isWebUri = require('valid-url').isWebUri;

const packageJSON = require('../package.json');

module.exports = function (target) {
	return new Promise((resolve, reject) => {
		if (isWebUri(target)) {
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
			}).catch(err => {
				return reject(new Error(err.message));
			});
		} else {
			fsReadFile(target, 'utf8', (err, content) => {
				if (err) {
					return reject(new Error(err.message));
				}

				return resolve({
					type: 'FILE',
					payload: content
				});
			});
		}
	});
};
