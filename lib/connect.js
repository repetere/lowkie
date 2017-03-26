'use strict';

const path = require('path');
const loki = require('lokijs');
const lokiFSAdapter = require('lokijs/src/loki-fs-structured-adapter.js');
const defaultDBPath = path.resolve(path.join(process.cwd(), './test.db.json'));

/**
 * connects lowkie to lokijs
 * 
 * @param {string} [dbpath=defaultDBPath] 
 * @param {object} [options={}] 
 * @returns {Promise}
 */
function connect(dbpath = defaultDBPath, options = {}) {
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

module.exports = connect;

