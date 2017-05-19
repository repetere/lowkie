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
function connect(dbpath = defaultDBPath, options = {}, lowkieConfig = {}, dbconnectionname = 'default') {
  this.config = Object.assign(this.config, lowkieConfig);
  const dbname = path.resolve(dbpath);
  const adapter = (this.config.adapterType === 'file') ? { adapter: new lokiFSAdapter(dbname), } : {};
  const lokiDBOptions = Object.assign({
      autosave: true,
      autosaveInterval: 5000, // 5 seconds
    },
    adapter, options);
  const t = setImmediate(() => {
    this.connection.emit('connecting', { dbname, options, });
    clearImmediate(t);
  });
  const db = new loki(dbname, lokiDBOptions);
  const ensureAdapterFilePromise = () => {
    if (!this.config.adapterType) {
      return Promise.reject(new Error('Invalid Adapter Type'));
    } else {
      return (this.config.adapterType === 'file') ?
        new Promise((resolve, reject) => {
          fs.ensureFile(dbname, (err) => {
            if (err) reject(err);
            else resolve(true);
          });
        }) :
        Promise.resolve();
    }
  };
  this.dbs[dbconnectionname] = db;
  if (dbconnectionname === 'default') {
    this.db = db;
  }
  this.connections.set(dbconnectionname, db);
  return new Promise((resolve, reject) => {
    try {
      let t = setImmediate(() => {
        ensureAdapterFilePromise()
          .then(() => {
            fs.readJSON(dbname, (err, dbdata) => {
              clearImmediate(t);
              if (this.config.overwriteInvalidJSON && err || (dbdata && (!dbdata.collections || !dbdata.collections.length))) {
                db.saveDatabase((err) => {
                  if (err) {
                    reject(err);
                  } else {
                    this.connection.emit('connected', db, { db, options, });
                    resolve(db);
                  }
                });
              } else if (err) {
                reject(err);
              } else {
                db.loadDatabase({}, (err) => {
                  if (err) {
                    reject(err);
                  } else {
                    this.connection.emit('connected', db, { db, options, });
                    resolve(db);
                  }
                });
              }
            });
          })
          .catch((e) => {
            this.connection.emit('connectionError', e, { dbname, options, });
            reject(e);
          });
      });
    } catch (e) {
      this.connection.emit('connectionError', e, { dbname, options, });
      reject(e);
    }
  });
}

module.exports = connect;