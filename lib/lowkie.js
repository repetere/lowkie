'use strict';
const path = require('path');
const events = require('events');
const loki = require('lokijs');
const lokiFSAdapter = require('lokijs/src/loki-fs-structured-adapter.js');
const defaultDBPath = path.resolve(path.join(process.cwd(), './test.db.json'));
const pluralize = require('pluralize');
const lowkieSchema = require('./schema');
/**
 * @const {object} handler
 * @description this is the proxy handler for lowkie, provides access to native loki methods as well.
 */
const handler = {
  get: function (target, name) {
    return target[ name ];
  },
};

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

    return new Proxy(this, handler);
  }
  connect(dbpath = defaultDBPath, options = {}) {
    const dbname = path.resolve(dbpath);
    const adapter = new lokiFSAdapter(dbname);
    const lokiDBOptions = Object.assign({
      // autoload: true,
      // autoloadCallback: loadHandler,
      autosave: true,
      autosaveInterval: 5000, // 5 seconds
      adapter,
    }, options);
    const t = setImmediate(() => {
      this.connection.emit('connecting', { dbname, options, });
      clearImmediate(t);
    });
    return new Promise((resolve, reject) => {
      try {
        let t = setImmediate(() => {
          const db = new loki(dbname, lokiDBOptions);
          this.db = db;
          this.connections.set('default', db);
          this.connection.emit('connected', db, { db, options, });
          resolve(db);
          clearImmediate(t);
        });
      } catch (e) {
        this.connection.emit('connectionError', e, { dbname, options, });
        reject(e);
      }
    });
  }
  Schema(scheme) {
    return new lowkieSchema(scheme, this);
  }
  model(model, Schema) {
    try {
      // console.log('this.connections.size', this.connections.size);
      if (!this.connections.size) throw new Error('There has to be an active lowkie connection before creating models, lowkie.connect is asynchronous');
      if (!(Schema instanceof lowkieSchema)) throw new Error(`${model} must be an instance of a lowkieSchema`);
      let modelName = pluralize(model);
      let modelProxy = this.db.addCollection(modelName);
      let modelHandler = {
        /*get: function (target, name) {return target[ name ];},*/
      };
      modelProxy.insert = new Proxy(modelProxy.insert, {
        apply: function (target, thisArg, argumentsList) {
          return Schema.insert({ target, thisArg, argumentsList, });
        },
      });
      return new Proxy(modelProxy, modelHandler);
    } catch (e) {
      if (this.debug) {
        console.error(e);
      }
      throw e;
    }
  }
}

module.exports = new lowkie({});
