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
  constructor (options = {}) {
    this.connections = new Map();
    this.db = undefined;
	events.EventEmitter.call(this);

    return new Proxy(this, handler);
  }
  connect(dbname='test.db', options={}) {
	this.emit('connecting',{dbname,options});
//  console.log('calleded connect');
    return new Promise((resolve, reject) => {
      
      try {
        const db = new loki(dbname, {
          // autoload: true,
          // autoloadCallback: loadHandler,
          // autosave: true,
          // autosaveInterval: 5000, // 5 seconds
          // adapter,
        });
		this.emit('connected',db,{db,options});
        resolve();
      } catch (e) {
		this.emit('connectionError',e,{dbname,options});
        reject(e);
      }
    })
  }
}

module.exports = new lowkie({});
