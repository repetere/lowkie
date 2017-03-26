'use strict';
const events = require('events');
const lowkieSchema = require('./schema');
const lowkieModel = require('./model');
const lowkieConnect = require('./connect');
const lowkieProxyHandler = require('./lowkieProxyHandler');
/**
 * lowkie ORM singleton class
 * 
 * @class lowkie
 */
class lowkie {
  /**
   * Creates an instance of lowkie.
   * @param {any} [options={}] 
   * 
   * @memberOf lowkie
   */
  constructor (options = {}) {
    this.connections = new Map();
    this.db = undefined;
    this.models = undefined;
    this.debug = options.debug;
    this.connection = new events.EventEmitter();
    this.model = lowkieModel.bind(this);
    this.connect = lowkieConnect.bind(this);
    return new Proxy(this, lowkieProxyHandler.call(this));
  }
  /**
   * creates lowkie schema, also includes helpers for document validations
   * 
   * @param {object} scheme 
   * @returns instance of lowkieSchema
   * 
   * @memberOf lowkie
   */
  Schema(scheme) {
    return new lowkieSchema(scheme, this);
  }
}

module.exports = new lowkie({});
