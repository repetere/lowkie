'use strict';

const path = require('path');
const loki = require('lokijs');
const fs = require('fs-extra');
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
  const t = setImmediate(() => {
    this.connection.emit('connecting', { dbname, options, });
    clearImmediate(t);
  });
  const dbname = path.resolve(dbpath);
  const adapter = (this.config.adapterType === 'file')
    ? new lokiFSAdapter(dbname)
    : this.config.adapter || {};
  const lokiDBOptions = Object.assign({
    // autoload: true,
    // autoloadCallback: loadHandler,
    autosave: true,
    autosaveInterval: 5000, // 5 seconds
  }, {
    adapter,  
  }, options);
  let db = undefined;
  let ensureAdapterFilePromise = (this.config.adapterType === 'file')
    ? new Promise((resolve, reject) => { 
      fs.ensureFile(dbname, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    })
    : Promise.resolve();
  return new Promise((resolve, reject) => {
    return ensureAdapterFilePromise
      .then(() => {
        db = new loki(dbname, lokiDBOptions);
        if (!db.collections || !db.collections.length) {
          db.saveDatabase((err) => {
            if (err) return reject(err);
            else return Promise.resolve(true);
          });
        } else {
          return Promise.resolve(true);
        }
        // console.log('db.collections',db.collections);
      })
      .then(() => {
        try {
          // throw new Error('cannot conecct pass here')
          db.loadDatabase({}, (err) => {
            console.log('loaded DB')
            if (err) return reject(err);
            else {
              this.db = db;
              this.connections.set('default', db);
              this.connection.emit('connected', db, { db, options, });
              console.log('LOADED db', { err, data });
              // let kittens = db.getCollection('kittens');
              // // console.log(Object.keys(kittens));
              // console.log('kittens.data', kittens.data);
              return resolve(db);
            }
          });
          // console.log('now load db', db.loadDatabase)
        } catch (e) {
          this.connection.emit('connectionError', e, { dbname, options, });
          return reject(e);
        }
      })
      .catch((e) => {
        this.connection.emit('connectionError', e, { dbname, options, });
        return reject(e);
      });
  });
}

module.exports = connect;