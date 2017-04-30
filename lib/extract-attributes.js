'use strict';

const urlResolve = require('url').resolve;
const xpath = require('xpath');
const DOMParser = require('xmldom').DOMParser;
const isWebUri = require('valid-url').isWebUri;

module.exports = function (content, attributes, baseUrl) {
	const attributesValues = {};

	if (typeof content !== 'string' || !content) {
		throw new Error('Content argument must be a valid string');
	}

	if (!Array.isArray(attributes) || attributes.length < 1) {
		throw new Error('Attributes argument must be an array with at least 1 element');
	}

	if (typeof baseUrl !== 'string' || !baseUrl || !isWebUri(baseUrl)) {
		throw new Error('Base URL argument must be a valid URL');
	}

	for (const attribute of attributes) {
		attributesValues[attribute] = xpath.select(`//@${attribute}`, new DOMParser({
			errorHandler: {
				// Suppress DOMParser errors
				warning: null, error: null, fatalError: null
			}
		}).parseFromString(content))
		// Get only the node value
		.map(node => {
			return node.value;
		})
		// Filter URIs other than http/https
		.filter(value => {
			return (/^[a-z0-9-.]+:/i.test(value) && /^(?!https?:)/i.test(value)) === false;
		})
		// Resolve relative URLs
		.map(value => {
			return urlResolve(baseUrl, value);
		});
	}

	return attributesValues;
};
