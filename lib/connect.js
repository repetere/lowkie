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
    autosave: true,
    autosaveInterval: 5000, // 5 seconds
    adapter,
  }, options);
  const t = setImmediate(() => {
    this.connection.emit('connecting', { dbname, options, });
    clearImmediate(t);
  });
  const db = new loki(dbname, lokiDBOptions);
  const ensureAdapterFilePromise = () => {
    return (this.config.adapterType === 'file')
      ? new Promise((resolve, reject) => {
        fs.ensureFile(dbname, (err) => {
          if (err) reject(err);
          else resolve(true);
        });
      })
      : Promise.resolve();
  };
  this.db = db;
  this.connections.set('default', db);
  return new Promise((resolve, reject) => {
    try {
      let t = setImmediate(() => {
        ensureAdapterFilePromise()
          .then(() => {
            fs.readJSON(dbname, (err, dbdata) => {
              clearImmediate(t);
              if (err || (dbdata && !dbdata.collections.length) ) {
                db.saveDatabase((err) => {
                  if (err) {
                    reject(err);
                  } else {
                    this.connection.emit('connected', db, { db, options, });
                    resolve(db);
                  }
                });
              } else{
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
          .catch(reject);
      });
    } catch (e) {
      this.connection.emit('connectionError', e, { dbname, options, });
      reject(e);
    }
  });
}

module.exports = connect;