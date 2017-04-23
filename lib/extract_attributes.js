'use strict';

const xpath      = require('xpath'),
      xmldom     = require('xmldom').DOMParser,
      isWebUri   = require('valid-url').isWebUri,
      urlResolve = require('url').resolve;

module.exports = function(content, attributes, baseUrl) {
  let attributesValues = {};

  if(typeof content !== 'string' || !content) {
    throw new Error('Content argument must be a valid string');
  }

  if(!Array.isArray(attributes) || attributes.length < 1) {
    throw new Error('Attributes argument must be an array with at least 1 element');
  }

  if(typeof baseUrl !== 'string' || !baseUrl || !isWebUri(baseUrl)) {
    throw new Error('Base URL argument must be a valid URL');
  }

  for(let attribute of attributes) {
    // attributesValues[attribute] = 'someAttribute';
    attributesValues[attribute] = xpath.select(`//@${attribute}`, new xmldom({
      errorHandler: {
        // suppress DOMParser errors
        warning: null, error: null, fatalError: null
      }
    }).parseFromString(content))
    // get only the node value
    .map(node => {
      return node.value
    })
    // filter URIs other than http/https
    .filter(value => {
      return (/^[a-z0-9-\.]+:/i.test(value)
             && /^(?!https?:)/i.test(value)) === false;
    })
    // resolve relative URLs
    .map(value => {
      return urlResolve(baseUrl, value);
    });
  }

  return attributesValues;
}
