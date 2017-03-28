'use strict';
/*jshint expr: true*/
const path = require('path');
const fs = require('fs-extra');
const events = require('events');
const sinon = require('sinon');
const chai = require('chai');
const expect = require('chai').expect;
const testConnectDBPath = path.join(__dirname, '../mock/connecttestdb.json');
const removeTestDB = require('../util/removeTestDB');
const invalidJSONPATH = path.join(__dirname, '../mock/invalid.db.json');
const invalidFILEPATH = path.join(__dirname, '../mock/invalid.db.jsonfile');
let lowkie = require('../../index');
let lowkieConnectTest = require('../../lib/connect');
let lowkieClass = require('../../lib/lowkieClass');

describe('Connect', function () {
  this.timeout(10000);
  before('intialize lowkie instances', (done) => {
    removeTestDB(testConnectDBPath, false);
  //   lowkie.connect(testConnectDBPath)
  //     .then((/*db*/) => { 
  //       // console.log('connected connecttestdb');
  //       testUserSchema = lowkie.Schema(testUserSchemaScheme);
  //       testUserModel = lowkie.model('testuser', testUserSchema);
  //       // console.log({testUserSchema})
        done();
  //     })
  //     .catch(done);
  });
	describe('#connect', function () {
    it('should be a bound method to Lowkie singleton', () => { 
      let lowkieConnect = lowkieConnectTest.bind(lowkie);
      expect(lowkieConnect.db).to.eql(lowkie.db);
    });
    it('should return a promise', () => { 
      let lowkieConnect = lowkieConnectTest.bind(lowkie);
      expect(lowkieConnect()).to.be.an.instanceof(Promise);
    });
    it('should set a default connection db', () => { 
      let lowkieConnect = lowkieConnectTest.bind(lowkie);
      lowkieConnect(testConnectDBPath);
      expect(lowkie.connections.has('default')).to.be.true;
    });
    it('should emit connecting event', (done) => {
      let lowkieConnect = lowkieConnectTest.bind(lowkie);
      lowkieConnect(testConnectDBPath);
      lowkie.connection.once('connecting', (status) => {
        expect(status).to.be.an('object');
        done();
      });
    });
    it('should emit connected event once connected to an existing db filepath', (done) => { 
      let lowkieConnect = lowkieConnectTest.bind(lowkie);
      lowkieConnect(testConnectDBPath);
      lowkie.connection.once('connected', (status) => {
        expect(status).to.be.an('object');
        done();
      });
    });
    it('should connect and load an existing db filepath', (done) => { 
      let newLOWKIE = new lowkieClass({});
      let lowkieConnect = lowkieConnectTest.bind(newLOWKIE);
      let existingDB = path.join(__dirname, '../mock/sampledb.json');

      lowkieConnect(existingDB)
        .then((db) => {
          expect(db).to.be.an('object');
          expect(db).to.eql(newLOWKIE.db);
          // done();
        })
        .catch(done);
      newLOWKIE.connection.once('connected', (status) => {
        expect(status).to.be.an('object');
        done();
      });
    });
    it('should emit connected event once connected to a new db filepath', (done) => { 
      let newLOWKIE = new lowkieClass({});
      let lowkieConnect = lowkieConnectTest.bind(newLOWKIE);
      let throwawayfilepath = path.join(__dirname, '../mock/connecttestthrowaway.json');
      lowkieConnect(throwawayfilepath);
      newLOWKIE.connection.once('connected', (status) => {
        expect(status).to.be.an('object');
        removeTestDB(throwawayfilepath);
        done();
      });
    });
    it('should allow for custom lowkie configurations', (done) => { 
      let newLOWKIE = new lowkieClass({});
      let lowkieConnect = lowkieConnectTest.bind(newLOWKIE);
      let throwawayfilepath = path.join(__dirname, '../mock/connecttestthrowaway2.json');
      lowkieConnect(throwawayfilepath, {}, { adapterType: 'default', })
        .then(() => { 
          // console.log('newLOWKIE.config', newLOWKIE.config);
          expect(newLOWKIE.config.adapterType).to.eql('default');
          removeTestDB(throwawayfilepath);
          done();
        })
        .catch(done);
    });
    it('should allow handle invalid database json', (done) => { 
      let newLOWKIE = new lowkieClass({});
      let lowkieConnect = lowkieConnectTest.bind(newLOWKIE);
      let throwawayfilepath = invalidJSONPATH;
      lowkieConnect(throwawayfilepath, {}, { adapterType: 'default', }, {
        overwriteInvalidJSON:false,
      })
        .then(() => { 
          // console.log('newLOWKIE.config', newLOWKIE.config);
          expect(newLOWKIE.config.adapterType).to.eql('default');
          done();
        })
        .catch(e => {
          console.log(e);
          done();
        });
    });
    it('should throw error handling invalid database file', (done) => { 
      let newLOWKIE = new lowkieClass({});
      let lowkieConnect = lowkieConnectTest.bind(newLOWKIE);
      let throwawayfilepath = invalidFILEPATH;
      lowkieConnect(throwawayfilepath, {}, {
        overwriteInvalidJSON:false,
      })
        .then(() => { 
          console.log('resoved here')
          // console.log('newLOWKIE.config', newLOWKIE.config);
          done();
        })
        .catch(e => {
          expect(e).to.be.instanceof(Error);
          done();
        });
    });
    it('should throw error on invalid adapter types and emit error', (done) => { 
      let newLOWKIE = new lowkieClass({});
      let lowkieConnect = lowkieConnectTest.bind(newLOWKIE);
      let throwawayfilepath = invalidFILEPATH;
      // expect(lowkieConnect.bind(lowkieConnect, throwawayfilepath, {}, {
      //   overwriteInvalidJSON: false,
      //   adapterType: false,
      // })).to.throw(Error);
      lowkieConnect(throwawayfilepath, {}, {
        overwriteInvalidJSON: false,
        adapterType:false,
      })
        .then(() => { 
          // console.log('resoved here')
          // console.log('newLOWKIE.config', newLOWKIE.config);
          // done();
        })
        .catch(e => {
          expect(e).to.be.instanceof(Error);
          // done();
        });
      
      newLOWKIE.connection.once('connectionError', (e) => {
        expect(e).to.be.instanceOf(Error);
        done();
      });
    });
    // it('should emit connection error', (done) => { 
    //   let newLOWKIE = new lowkieClass({});
    //   let lowkieConnect = lowkieConnectTest.bind(newLOWKIE);
    //   let throwawayfilepath = invalidFILEPATH;
    //   let nameCounter = 0;
    //   let configProxy = new Proxy({
    //     overwriteInvalidJSON: false,
    //     adapterType: 'default',
    //   }, {
    //     get: function (target, name) {
    //       if (name === 'adapterType') {
    //         nameCounter++;
    //       } 
    //       if (nameCounter > 0) {
    //         // throw new Error('testing error handling');
    //         console.log({ target, name, nameCounter });
    //         return new Error('testing error handling');  
    //       } else {
    //         console.log({ target, name, nameCounter });
    //         return target[ name ];
    //       }
    //     },
    //   });
    //   lowkieConnect('/private', {}, configProxy)
    //     .catch((e) => {
    //       console.log(e);//do nothing, wait for event
    //       // done();
    //     });
    //   newLOWKIE.connection.once('connectionError', (e) => {
    //     expect(e).to.be.instanceOf(Error);
    //     done();
    //   });
    // });
  });
  after('remove test schema db', () => {
    removeTestDB(testConnectDBPath, true);
    fs.outputJsonSync(invalidJSONPATH, {});
  });
});