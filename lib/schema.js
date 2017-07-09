'use strict';
const flatten = require('flat');
const ObjectId = require('./object_id');
const pluralize = require('pluralize');
const moment = require('moment');

var isExternalRef = function(key) {
  let properties = key.split('.');
  return (properties[properties.length - 1] === 'ref');
};

var isTypeDef = function(key) {
  let properties = key.split('.');
  return (properties[properties.length - 1] === 'type');
};

var isDefaultDef = function(key) {
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
    let flatKeys = Object.keys(this.flattenedScheme);
    this.default_defs = flatKeys.filter(isDefaultDef);
    this.external_refs = flatKeys.filter(isExternalRef);
    this.type_defs = flatKeys.filter(isTypeDef);
    this.validNames = Object.keys(this.flattenedScheme).reduce((result, key) => {
      let properties = key.split('.');
      let parentKey = properties.slice(0, properties.length - 1).join('.');
      if (this.default_defs.indexOf(key) === -1 && this.external_refs.indexOf(key) === -1 && this.type_defs.indexOf(key) === -1) {
        result.push(key);
      } else if (result.indexOf(parentKey) === -1) {
        result.push(parentKey);
      }
      return result;
    }, []).concat(['_id']);
    this.lowkie = lowkieSingleton;
    this.createDoc = this.createDocument.bind(this);
    this.dbconnection = db;
    if (!lowkieSingleton) {
      throw new Error('Invalid schema invocation, try using lowkie.Schema instead of Schema');
    }
    return this;
  }
  validateDocument(original_document) {
      const _document = flatten(original_document);
      return flatten.unflatten(this.validNames.reduce((result, key) => {
        if (_document[key]) {
          let validType = this.flattenedScheme[`${ key }.type`] || this.flattenedScheme[key];
          if (validType === Date) {
            result[key] === Number(moment(_document[key]).format('x'));
          } if (typeof _document[key] === 'string' && (validType === String || validType === ObjectId)) {
            result[key] = _document[key].toString();
          } else if (validType === Boolean) {
            result[key] = (_document[key]) ? true : false;
          } else if (validType === Number) {
            result[key] = Number(_document[key]);
          } else if (typeof _document[key] === 'object' && (validType === Array || validType === Object)) {
            result[key] = _document[key];
          }
        } else if (this.default_defs.indexOf(`${ key }.default`) !== -1 && !_document[key]) {
          if (typeof this.flattenedScheme[`${ key }.default`] === 'function') result[key] = this.flattenedScheme[`${ key }.default`]();
          else result[key] = this.flattenedScheme[`${ key }.default`];
        } else if (typeof original_document[key] === 'object' && typeof this.flattenedScheme[key] === 'function' && this.flattenedScheme[key] === Object) { //schema type mixed
          result[key] = original_document[key];
        }
        return result;
      }, { _id: _document._id }));
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
  /**
   * overwrites the default remove method
   * 
   * @param {any} options 
   * @returns Promise
   * 
   * @memberOf lowkieSchema
   */
  remove(options = {}) {
    let lokiCollectionRemove = options.target;
    let lowkieInstance = options.thisArg;
    let lowkieDocument = options.argumentsList;

    // let { target, thisArg, argumentsList, } = options;
    return new Promise((resolve, reject) => {
      try {
        if (Array.isArray(lowkieDocument)) {
          lowkieDocument.forEach(delDoc => {
            lokiCollectionRemove.call(lowkieInstance, delDoc);
          });
        } else {            
          lokiCollectionRemove.call(lowkieInstance, lowkieDocument);
        }
        this.lowkie.dbs[this.dbconnection].saveDatabase((err) => {
          if (err) reject(err);
          else return resolve(lowkieDocument);
        });
      } catch (e) {
        reject(e);
      }
    });
  }
  populate(model, refs = '', query = {}) {
    let _refs = (Array.isArray(refs)) ? refs : refs.split(' ');
    _refs = _refs.map(ref => {
      if (ref && typeof ref === 'object') return ref;
      return { path: ref };
    });
    let collections = this.lowkie.dbs[this.dbconnection].collections;
    let flattened = this.flattenedScheme;
    let _documents = model.chain().find(query);
    return _documents.data().reduce((result, doc) => {
      let flattenedDoc = flatten(doc);
      _refs.forEach(ref => {
        let name = pluralize(flattened[`${ ref.path }.ref`]);
        let toPopulate = collections.filter(collection => collection.name === name)[0];
        let _id = flattenedDoc[ref.path];
        if (_id) {
          let childDocument = toPopulate.chain().find({ _id }).data()[0];
          flattenedDoc[ref.path] = childDocument || null;
        }
      });
      return result.concat(flatten.unflatten(flattenedDoc));
    }, []);
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