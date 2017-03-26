'use strict';

module.exports = class lowkieSchema {
  constructor(scheme, lowkieSingleton) {
    this.scheme = scheme;
    this.lowkie = lowkieSingleton;
    // this.properties = properties;
    return this;
  }
  insert(options) {
    let lokiCollectionInsert = options.target;
    let lowkieInstance = options.thisArg;
    let lowkieDocument = options.argumentsList;
    // let { target, thisArg, argumentsList, } = options;
    return new Promise((resolve, reject) => {
      try {
        lokiCollectionInsert.call(lowkieInstance, lowkieDocument);
        // console.log( 'this.lowkie',this.lowkie );
        this.lowkie.db.saveDatabase((err) => {
          if (err) reject(err);
          else return resolve(lowkieDocument);
          
        });
      } catch (e) {
        reject(e);
      }
    });
  }
};

