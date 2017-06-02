'use strict';
const flatten = require('flat');
const ObjectId = require('./object_id');
/**
 * proxy for creating new loki documents
 * 
 * @class lowkieSchema
 */
class lowkieSchema {
  constructor(scheme, lowkieSingleton, db = 'default') {
    this.scheme = scheme;
    this.flattenedScheme = flatten(scheme);
    this.validNames = Object.keys(scheme).concat(['_id', ]);
    this.lowkie = lowkieSingleton;
    this.createDoc = this.createDocument.bind(this);
    this.dbconnection = db;
    if (!lowkieSingleton) {
      throw new Error('Invalid schema invocation, try using lowkie.Schema instead of Schema');
    }

    return this;
  }
    /**
     * returns validated document for lokijs
     * 
     * @param {any} doc 
     * @returns object
     * 
     * @memberOf lowkieSchema
     */
  createDocument(doc) {
    let defaultDoc = Object.keys(this.scheme).reduce((result, key)=>{
      if(typeof this.scheme==='object' && this.scheme[key] && this.scheme[key].default){
        if(this.scheme[key].default===Date.now){
          result[key] = new Date();
        } else{
          result[key] = typeof this.scheme[key].default ==='function' ? this.scheme[key].default.call() : this.scheme[key].default;
        }
      }
      return result;
    }, {});
    let newDoc = Object.assign({}, defaultDoc, {
      _id: ObjectId.createId(),
    }, doc);
    let validDoc = this.validNames.reduce((result, key) => {
        // if (this.lowkie.config.strictSchemas) {
        //   if (typeof newDoc[ key ] === 'string' && (this.scheme[ key ] !== String || (this.scheme[key].type !== String))) {
        //     throw new Error(`${key} (${newDoc[ key ] } - ${typeof newDoc[ key ]}) must be a valid String`);
        //   }
        // }

      if (newDoc[key]) {
        if (typeof newDoc[key] === 'string' && this.scheme[key] === String) {
          result[key] = newDoc[key].toString();
        } else if (this.scheme[key] === Boolean) {
          result[key] = (newDoc[key]) ? true : false;
        } else if (this.scheme[key] === Number) {
          result[key] = Number(newDoc[key]);
        } else if (typeof newDoc[key] === 'object') {
          result[key] = newDoc[key];
        } else {
          result[key] = newDoc[key];
        }
      }
      return result;
    }, {});
    return validDoc;
  }
    /**
     * overwrites the default insert method
     * 
     * @param {any} options 
     * @returns Promise
     * 
     * @memberOf lowkieSchema
     */
  insert(options = {}) {
    let lokiCollectionInsert = options.target;
    let lowkieInstance = options.thisArg;
    let lowkieDocument = options.argumentsList;

    // let { target, thisArg, argumentsList, } = options;
    return new Promise((resolve, reject) => {
      try {
        let newDoc = (Array.isArray(lowkieDocument)) ?
          lowkieDocument.map(lowkiedoc => this.createDoc(lowkiedoc)) :
          this.createDoc(lowkieDocument);
        lokiCollectionInsert.call(lowkieInstance, newDoc);
        this.lowkie.dbs[this.dbconnection].saveDatabase((err) => {
          if (err) reject(err);
          else return resolve(newDoc);
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}

/**
 * schema data types
 */
lowkieSchema.Types = {
  String,
  Buffer,
  Date,
  Number,
  ObjectId,
  Array,
  Mixed: Object,
};

module.exports = lowkieSchema;