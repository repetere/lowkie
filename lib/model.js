'use strict';
const pluralize = require('pluralize');
const lowkieSchema = require('./schema');

/**
 * lowkie model proxy for lokijs collection
 * 
 * @param {string} model name of lowkie model
 * @param {class} Schema instance of lokieSchema  
 * @returns 
 */
function model(model, Schema) {
  try {
    // console.log('this.connections.size', this.connections.size);
    if (!this.connections.size) throw new Error('There has to be an active lowkie connection before creating models, lowkie.connect is asynchronous');
    if (!(Schema instanceof lowkieSchema)) throw new Error(`${model} must be an instance of a lowkieSchema`);
    let modelName = pluralize(model);
    let modelProxy = this.db.addCollection(modelName);
    let modelHandler = {
      /*get: function (target, name) {return target[ name ];},*/
    };
    modelProxy.insert = new Proxy(modelProxy.insert, {
      apply: function (target, thisArg, argumentsList) {
        return Schema.insert({ target, thisArg, argumentsList, });
      },
    });
    return new Proxy(modelProxy, modelHandler);
  } catch (e) {
    if (this.debug) {
      console.error(e);
    }
    throw e;
  }
}

module.exports = model;


