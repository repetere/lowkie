'use strict';
const path = require('path');
const events = require('events');
const loki = require('lokijs');
const lokiFSAdapter = require('lokijs/src/loki-fs-structured-adapter.js');
const defaultDBPath = path.resolve(path.join(process.cwd(), './test.db'));

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
    this.connection = new events.EventEmitter();

    return new Proxy(this, handler);
  }
  connect(dbpath = defaultDBPath), options = {}) {
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
        const db = new loki(dbname, lokiDBOptions);
        this.db = db;
        this.connections.set('default', db);
        let t = setImmediate(() => {
          this.connection.emit('connected', db, { db, options, });
          clearImmediate(t);
        });
        resolve(db);
      } catch (e) {
        this.connection.emit('connectionError', e, { dbname, options, });
        reject(e);
      }
    });
  }
}

module.exports = new lowkie({});
