'use strict';
const flatten = require('flat');
const ObjectId = require('./object_id');
/**
 * proxy for creating new loki documents
 * 
 * @class lowkieSchema
 */
class lowkieSchema {
  constructor(scheme, lowkieSingleton) {
    this.scheme = scheme;
    this.flattenedScheme = flatten(scheme);
    this.validNames = Object.keys(scheme);
    this.lowkie = lowkieSingleton;
    this.createDoc = this.createDocument.bind(this);
    this.validNames.push('_id');
    console.log(this.lowkie.config);
    // this.properties = properties;
    return this;
  }
  // getValidNames(scheme) {
    
  // }
  createDocument(doc) {
    let newDoc = Object.assign({
      _id: ObjectId.createId(),
    }, doc);
    let validDoc = this.validNames.reduce((result, key) => { 
      // if (this.lowkie.config.strictSchemas) {
      //   if (typeof newDoc[ key ] === 'string' && (this.scheme[ key ] !== String || (this.scheme[key].type !== String))) {
      //     throw new Error(`${key} (${newDoc[ key ] } - ${typeof newDoc[ key ]}) must be a valid String`);
      //   }
      // }
      if (newDoc[ key ]) {
        if (typeof newDoc[ key ] === 'string' && this.scheme[ key ] === String) {
          result[ key ] = newDoc[ key ].toString();
        } else if (typeof newDoc[ key ] === 'boolean' && this.scheme[ key ] === Boolean) {
          result[ key ] = (newDoc[ key ]) ? true : false;
        } else if (this.scheme[ key ] === Number) {
          result[ key ] = Number(newDoc[ key ]);
        } else if (typeof newDoc[ key ] === 'object') {
          result[ key ] = newDoc[ key ];
        } else {
          result[ key ] = newDoc[ key ];
        }
      }
      return result;
    }, {});
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