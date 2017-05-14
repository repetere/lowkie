'use strict';
const flatten = require('flat');
const ObjectId = require('./object_id');

var isIgnoredKey = function (value, key) {
  let isType = (key === 'type' || (key === 'type' && value[key] && !Boolean(value[key][key])));
  let isDefault = (key === 'default' || (key === 'default' && value[key] && !Boolean(value[key][key])));
  let isRef = (key === 'ref' || (key === 'ref' && value[key] && !Boolean(value[key][key])));
  return (isRef || isDefault || isType);
};

var setValidPaths = function (schema, final = [], parent = '') {
  return Object.keys(schema).reduce((result, key) => {
    if (!isIgnoredKey(schema[key], key) && result.indexOf((parent.length) ? `${ parent }.${ key }` : key) === -1) {
      if (schema[key] && typeof schema[key] === 'object') {
        result.push(key);
        result = result.concat(setValidPaths(schema[key], result, (parent.length) ? `${ parent }.${ key }` : key));
      } else {
        result.push((parent.length) ? `${ parent }.${ key }` : key);
      }
    }
    return result;
  }, final);
};

/**
 * proxy for creating new loki documents
 * 
 * @class lowkieSchema
 */
class lowkieSchema {
  constructor(scheme, lowkieSingleton) {
    this.scheme = scheme;
    this.flattenedScheme = flatten(scheme);
    this.validNames = Object.assign([], setValidPaths(scheme));
    this.lowkie = lowkieSingleton;
    this.createDoc = this.createDocument.bind(this);
    this.validNames.push('_id');
    // console.log(this.lowkie.config);
    // this.properties = properties;
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
  validateDocument (_document, parentKey = '') {
    return this.validNames.reduce((result, key) => {
      if (_document[ key ]) {
        if (typeof _document[ key ] === 'string' && this.scheme[ key ] === String) {
          result[ key ] = _document[ key ].toString();
        } else if (this.scheme[ key ] === Boolean) {
          result[ key ] = Boolean(_document[key]);
        } else if (this.scheme[ key ] === Number) {
          result[ key ] = Number(_document[ key ]);
        } else if (typeof _document[ key ] === 'object') {
          result[ key ] = _document[ key ];
        } else {
          result[ key ] = _document[ key ];
        }
      }
      if (result[key] === undefined && this.scheme[key] && this.scheme[key].default) {
        result[key] = this.scheme[key].default;
      }
      let isNested = key.indexOf('.');
      if (isNested > -1) {
        let parentProperty = key.substring(0, isNested);
        let nestedProperty = key.substring(isNested + 1);
        if (!_document[parentProperty] || (_document[parentProperty] && typeof _document
        [parentProperty] !== 'object')) {
          result[parentProperty] = _document[parentProperty];
        } else if (nestedProperty !== 'default' && nestedProperty !== 'type') {
          result[parentProperty] = this.validateDocument(result[parentProperty] || {},parentProperty);
        }
      }
      return result;
    }, {});
  }
  createDocument(doc) {
    let validated = this.validateDocument(doc);
    return Object.assign({
      _id: ObjectId.createId(),
    }, validated);
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
  Mixed:Object,
};

module.exports = lowkieSchema;