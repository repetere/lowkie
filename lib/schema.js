'use strict';
const ObjectId = require('./object_id');
/**
 * proxy for creating new loki documents
 * 
 * @class lowkieSchema
 */
class lowkieSchema {
  constructor(scheme, lowkieSingleton) {
    this.scheme = scheme;
    this.lowkie = lowkieSingleton;
    this.createDoc = this.createDocument.bind(this);
    // this.properties = properties;
    return this;
  }
  createDocument(doc) {
    let validDoc = Object.assign({
      _id: ObjectId.createId(),
    }, doc);
    console.log({ validDoc });
    return validDoc;
  }
  insert(options) {
    let lokiCollectionInsert = options.target;
    let lowkieInstance = options.thisArg;
    let lowkieDocument = options.argumentsList;
    // let { target, thisArg, argumentsList, } = options;
    return new Promise((resolve, reject) => {
      try {
        let newDoc = (Array.isArray(lowkieDocument))
          ? lowkieDocument.map(lowkiedoc=>this.createDoc(lowkiedoc))
          : this.createDoc(lowkieDocument);
        lokiCollectionInsert.call(lowkieInstance, newDoc);
        this.lowkie.db.saveDatabase((err) => {
          if (err) reject(err);
          else return resolve(newDoc);
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}

module.exports = lowkieSchema;