'use strict';
const pluralize = require('pluralize');
const lowkieSchema = require('./schema');

/**
 * lowkie model proxy for lokijs collection
 * 
 * @param {string} model name of lowkie model
 * @param {class} Schema instance of lokieSchema  
 * @returns Proxy
 */
function model(model, Schema, collectionOptions = {}) {
  try {
    // console.log('this.connections.size', this.connections.size);
    if (!this.connections.size) throw new Error('There has to be an active lowkie connection before creating models, lowkie.connect is asynchronous');
    if (!(Schema instanceof lowkieSchema)) throw new Error(`${model} must be an instance of a lowkieSchema`);
    let modelName = pluralize(model);
    let existingCollection = this.db.getCollection(modelName);
    let modelProxy = (existingCollection)
      ? existingCollection
      : this.db.addCollection(modelName,collectionOptions);
    let modelHandler = {
      /*get: function (target, name) {return target[ name ];},*/
    };
    modelProxy.insert = new Proxy(modelProxy.insert, {
      apply: function (target, thisArg, argumentsList) {
        return Schema.insert({ target, thisArg, argumentsList, });
      },
    });
    let newModelProxy = new Proxy(modelProxy, modelHandler);
    this.models[ modelName ] = newModelProxy;
    return newModelProxy;
  } catch (e) {
    if (this.debug) {
      console.error(e);
    }
    throw e;
  }
}

module.exports = model;


