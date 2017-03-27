'use strict';
const events = require('events');
const lowkieSchema = require('./schema');
const lowkieModel = require('./model');
const lowkieConnect = require('./connect');
const lowkieProxyHandler = require('./lowkieProxyHandler');
const lowkieClass = require('./lowkieClass');

module.exports = new lowkieClass({});
