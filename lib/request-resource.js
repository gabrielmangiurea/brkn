'use strict';

const rp = require('request-promise');

const packageJSON = require('../package.json');

module.exports = function (resourceUrl) {
	return new Promise((resolve, reject) => {
		rp({
			uri: resourceUrl,
			method: 'get',
			headers: {
				'User-Agent': `${packageJSON.name}/${packageJSON.version} (${packageJSON.homepage})`
			},
			resolveWithFullResponse: true
		}).then(response => {
			resolve(response);
		}).catch(err => {
			reject(err);
		});
	});
};
