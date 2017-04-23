// Shared instance of EventEmitter to pass around data between different files

const EventEmitter = require('events').EventEmitter;
module.exports = new EventEmitter();
