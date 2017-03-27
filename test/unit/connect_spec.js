'use strict';
/*jshint expr: true*/
const path = require('path');
const events = require('events');
const chai = require('chai');
const fs = require('fs-extra');
const expect = require('chai').expect;
const testConnectDBPath = path.join(__dirname, '../mock/connecttestdb.json');
const removeTestDB = require('../util/removeTestDB');
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
  });
  after('remove test schema db', () => {
    removeTestDB(testConnectDBPath, true);
  });
});