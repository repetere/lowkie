'use strict';
const flatten = require('flat');
const ObjectId = require('./object_id');

var isExternalRef = function (key) {
  let properties = key.split('.');
  return (properties[properties.length - 1] === 'ref');
};

var isTypeDef = function (key) {
  let properties = key.split('.');
  return (properties[properties.length - 1] === 'type');
};

var isDefaultDef = function (key) {
  let properties = key.split('.');
  return (properties[properties.length - 1] === 'default');
};

/**
 * proxy for creating new loki documents
 * 
 * @class lowkieSchema
 */
class lowkieSchema {
  constructor(scheme, lowkieSingleton, db = 'default') {
    this.scheme = scheme;
    this.flattenedScheme = flatten(scheme);
    this.default_defs = flattenedScheme.filter(isDefaultDef);
    this.external_refs = flattenedScheme.filter(isExternalRef);
    this.type_defs = flattenedScheme.filter(isTypeDef);
    this.validNames = Object.keys(scheme).concat(['_id']);
    this.lowkie = lowkieSingleton;
    this.createDoc = this.createDocument.bind(this);
    this.dbconnection = db;
    if (!lowkieSingleton) {
      throw new Error('Invalid schema invocation, try using lowkie.Schema instead of Schema');
    }
    return this;
  }
  validateDocument (_document) {
    _document = flatten(_document);
    return this.flattenedScheme.reduce((result, key) => {
      if ()
    }, { _id: _document._id });
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
    let newDoc = Object.assign({
      _id: ObjectId.createId(),
    }, doc);
    return this.validateDocument(newDoc);
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