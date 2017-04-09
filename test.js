import test from 'ava';

const brkn = require('./brkn').brkn;

test('should resolve with an array', t => {
  return brkn('https://www.google.com', ['src'], false)
  .then(result => {
    t.true(Array.isArray(result));
  });
});

test('should reject with an object', t => {
  return brkn('bad.url', ['href'], false)
  .catch(err => {
    t.is(typeof err, 'object');
  });
});
