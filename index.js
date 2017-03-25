'use strict';
const path = require('path');
const events = require('events');
const loki = require('lokijs');

const handler = {
  get: function (target, name) {
    // if (name !== 'connect') {
      console.log({ target, name });
    // }
    if(name === 'false') {
      return name in target
        ? target[ name ]
        : 37;
    } else {
      return target[ name ];
    }
  },
};

class lowkie {

	/**
	 * Creates an interface
	 * @param  {Object} [options={}] A set of properties defined by keys with their allowed types as values. Each property will be required by newly constructed classes from this interface
	 */
  constructor (options = {}) {
    this.connections = new Map();
    this.db = undefined;
    return new Proxy(this, handler);
  }
  connect(dbname='test.db', options={}) {
    console.log('calleded connect');
    return new Promise((resolve, reject) => {
      
      try {
        const db = new loki(dbname, {
          // autoload: true,
          // autoloadCallback: loadHandler,
          // autosave: true,
          // autosaveInterval: 5000, // 5 seconds
          // adapter,
        });
        resolve();
      } catch (e) {
        reject(e);
      }
    })
  }
}

module.exports = new lowkie({});
