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
  console.log('this.config',this.config)
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
  let ensureAdapterFilePromise = () => {
    return (this.config.adapterType === 'file')
      ? new Promise((resolve, reject) => {
        fs.ensureFile(dbname, (err) => {
          if (err) reject(err);
          else resolve(true);
        });
      })
      : Promise.resolve();
  };
  return new Promise((resolve, reject) => {
    try {
      let t = setImmediate(() => {
        ensureAdapterFilePromise()
          .then((filecheckstats) => {
            console.log({ filecheckstats, });
            return filecheckstats;
          })
          .then(() => {
            console.log('also here')
            db.loadDatabase({}, (err) => {
              clearImmediate(t);
              console.log('loaded DB')
              if (err) {
                return reject(err);
              } else {
                this.db = db;
                this.connections.set('default', db);
                this.connection.emit('connected', db, { db, options, });
                console.log('LOADED db', { err, });
                // let kittens = db.getCollection('kittens');
                // // console.log(Object.keys(kittens));
                // console.log('kittens.data', kittens.data);
                return resolve(db);
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

