'use strict';

const test = require('ava');
const ps = require('./lib/parse-source');
const ea = require('./lib/extract-attributes');

test('lib/parse_source.js: must return an object', async t => {
	await ps('https://www.google.com')
	.then(response => {
		t.is(typeof response, 'object');
	}).catch(err => {
		t.is(typeof err, 'object');
	});
});

test('lib/parse_source.js: web sources must have the correct type (URI)', async t => {
	const web = await ps('https://gabrielmangiurea.github.io');
	t.is(web.type, 'URI');
});

test('lib/parse_source.js: file sources must have the correct type (FILE)', async t => {
	const file = await ps('./fixtures/page1.html');
	t.is(file.type, 'FILE');
});

test('lib/extract_attributes.js: must throw when content argument is not a string', t => {
	const error = t.throws(() => {
		ea(['<b>html</b>'], ['tag'], 'https://base');
	});

	t.is(error.message, 'Content argument must be a valid string');
});

test('lib/extract_attributes.js: must throw when attributes argument is not an array', t => {
	const error = t.throws(() => {
		ea('<b>html</b>', 'tag', 'https://base');
	});

	t.is(error.message, 'Attributes argument must be an array with at least 1 element');
});

test('lib/extract_attributes.js: must throw when baseUrl argument is not a valid URL', t => {
	const error = t.throws(() => {
		ea('<b>html</b>', ['tag'], 42);
	});

	t.is(error.message, 'Base URL argument must be a valid URL');
});

test('lib/extract_attributes.js: must return an object', t => {
	const f = ea('<b>html</b>', ['tag'], 'https://base');

	t.is(typeof f, 'object');
});

test('lib/extract_attributes.js: must return the correct format and data', t => {
	const f1 = ea('<a href="somepage.html">somepage</a>', ['href'], 'https://baseurl.com');
	const f2 = ea('<image src="someimage.png" />', ['src'], 'https://baseurl.com');
	const f3 = ea(`
			<html>
			<head>
				<link href="somestylesheet.css" rel="stylesheet" />
			</head>
			<body>
				<a href="somelink.html">
					<img src="someimage.png" />
				</a>
				<script src="somescript.js"></script>
			</body>
		`,
		['href', 'src'], 'https://baseurl.com');

	t.deepEqual(f1, {href: ['https://baseurl.com/somepage.html']});
	t.deepEqual(f2, {src: ['https://baseurl.com/someimage.png']});
	t.deepEqual(f3,
		{href: ['https://baseurl.com/somestylesheet.css', 'https://baseurl.com/somelink.html'],
			src: ['https://baseurl.com/someimage.png', 'https://baseurl.com/somescript.js']}
	);
});
