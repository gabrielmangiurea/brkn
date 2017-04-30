'use strict';

const urlResolve = require('url').resolve;

const parseSource = require('./lib/parse-source');
const eventEmitter = require('./event-emitter');
const requestResource = require('./lib/request-resource');
const extractAttributes = require('./lib/extract-attributes');

module.exports = function (sources, attributes, baseUrl, opts) {
	// Init
	const counter = {
		global: {
			current: 0,
			total: 0
		},
		// Object of sources counters
		source: {}
	};

	const brokenUrls = [];
	const cachedUrls = [];

	// Arguments validations
	if (!Array.isArray(sources) || sources.length < 1) {
		throw new Error('Sources argument must be an array with at least 1 element');
	}

	if (!baseUrl) {
		throw new Error('Base URL argument must be a valid URL');
	}

	if (typeof opts !== 'object') {
		throw new TypeError('Options argument must be of object type');
	}

	for (const source of sources) {
		parseSource(source).then(parsed => {
			// Reset the source counter for each source
			counter.source[source] = {};
			counter.source[source].current = 0;
			counter.source[source].total = 0;

			// Initialize the brokenUrl and cachedUrls arrays for each source
			brokenUrls[source] = [];
			cachedUrls[source] = [];

			const attrs = extractAttributes(parsed.payload, attributes, urlResolve(baseUrl, '/'));

			for (const attr in attrs) {
				if (Object.prototype.hasOwnProperty.call(attrs, attr)) {
					for (const url of attrs[attr]) {
						if (url === urlResolve(baseUrl, '/') || cachedUrls[source].includes(url)) {
							continue;
						}

						++counter.global.total;
						++counter.source[source].total;
						cachedUrls[source].push(url);

						requestResource(url)
						.then(response => {
							if (opts && opts.verbose) {
								eventEmitter.emit('item', {
									broken: false,
									source: sources.length > 1 ? source : null,
									statusCode: response.statusCode,
									url
								});
							}
						}).catch(err => {
							if (opts && opts.verbose) {
								eventEmitter.emit('item', {
									broken: true,
									source: sources.length > 1 ? source : null,
									statusCode: err.statusCode,
									url
								});
							}

							brokenUrls[source].push(url);
						}).then(() => {
							if (sources.length > 1 && (++counter.source[source].current >= counter.source[source].total)) {
								if (opts && opts.verbose) {
									eventEmitter.emit('source', {
										source,
										brokenUrls: brokenUrls[source]
									});
								}
							}

							if (++counter.global.current >= counter.global.total) {
								/* BrokenUrls is an array of objects
								with the keys being each of the sources
								and the values being every broken url for that source
								we only need the values for all the keys in this case */
								const broken = [];

								for (const item in brokenUrls) {
									if (Object.prototype.hasOwnProperty.call(brokenUrls, item)) {
										for (const each of brokenUrls[item]) {
											broken.push(each);
										}
									}
								}

								eventEmitter.emit('end', broken);
							}
						});
					}
				}
			}
		}).catch(err => {
			eventEmitter.emit('error', err);
		});
	}
};
