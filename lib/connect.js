'use strict';

const path = require('path');
const fs = require('fs-extra');
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
  const db = new loki(dbname, lokiDBOptions);
  return new Promise((resolve, reject) => {
    try {
      // let t = setImmediate(() => {
      db.loadDatabase({}, (err) => {
      // clearImmediate(t);
        console.log('loaded DB')
        if (err) return reject(err);
        else {
          this.db = db;
          this.connections.set('default', db);
          this.connection.emit('connected', db, { db, options, });
          console.log('LOADED db', { err, });
          // let kittens = db.getCollection('kittens');
          // // console.log(Object.keys(kittens));
          // console.log('kittens.data', kittens.data);
          return resolve(db);
        }
      // });
      });
    } catch (e) {
      this.connection.emit('connectionError', e, { dbname, options, });
      reject(e);
    }
  });
}

module.exports = connect;

