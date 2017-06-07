'use strict';
const pluralize = require('pluralize');
const lowkieSchema = require('./schema');
const isChained = Symbol('isChained');
const CHAIN = Symbol('__chain__');

/**
 * lowkie model proxy for lokijs collection
 * 
 * @param {string} model name of lowkie model
 * @param {class} Schema instance of lokieSchema  
 * @returns Proxy
 */
function model(model, Schema, collectionOptions = {}, dbconnectionname = 'default') {
  try {
    // console.log('this.connections.size', this.connections.size);
    if (!this.connections.size) throw new Error('There has to be an active lowkie connection before creating models, lowkie.connect is asynchronous');
    if (!model || typeof model !== 'string') throw new Error('model name must be a valid string');
    if (!(Schema instanceof lowkieSchema)) throw new Error(`${model} must be an instance of a lowkieSchema`);
    let modelName = pluralize(model);
    let existingCollection = this.dbs[dbconnectionname].getCollection(modelName);
    let modelProxy = (existingCollection) ?
      existingCollection :
      this.dbs[dbconnectionname].addCollection(modelName, collectionOptions);
    let populate = function (refs, query) {
      return Schema.populate(modelProxy, refs, query);
    };
    let modelHandler = {
      // get: function (target, name) {
      //   if (typeof target[name] === 'function') {

      //   }
      //   return target[name];
      // }
    };
    modelProxy.insert = new Proxy(modelProxy.insert, {
      apply: function(target, thisArg, argumentsList) {
        return Schema.insert({ target, thisArg, argumentsList, });
      },
    });
    modelProxy.populate = populate;
    let newModelProxy = new Proxy(modelProxy, modelHandler);
    this.models[modelName] = newModelProxy;
    return newModelProxy;
  } catch (e) {
    if (this.debug) {
      console.error(e);
    }
    throw e;
  }
}

module.exports = model;