'use strict';
/*jshint expr: true*/
const path = require('path');
const events = require('events');
const chai = require('chai');
const fs = require('fs-extra');
const expect = require('chai').expect;
const testSchemaDBPath = path.join(__dirname, '../mock/modeltestdb.json');
const removeTestDB = require('../util/removeTestDB');
let lowkie = require('../../index');
let lowkieClass = require('../../lib/lowkieClass');
let testUserModelScheme = {
  name: String,
  email: String,
  active: Boolean,
  age: Number,
  profile: {
    type: String,
    default: 'no profile',
  },
};
let testUserModel;
// let testUserModel;

describe('Model', function () {
  this.timeout(10000);
  before('intialize lowkie instance', (done) => {
    removeTestDB(testSchemaDBPath, false);
    lowkie.connect(testSchemaDBPath)
      .then((/*db*/) => { 
        // console.log('connected modeltestdb');
        // testUserModel = lowkie.Schema(testUserModelScheme);
        // testUserModel = lowkie.model('testuser', testUserModel);
        // console.log({testUserModel})
        done();
      })
      .catch(done);
  });
	describe('Creation', function () {
    it('should throw an error if creating a model before databse is loaded', function () {
      let newLOWKIE = new lowkieClass({});
      expect(newLOWKIE.model.bind(newLOWKIE)).to.throw('There has to be an active lowkie connection before creating models, lowkie.connect is asynchronous');
    });
    it('should throw an error if model name is not a valid string', function (done) {
      let newLOWKIE = new lowkieClass({});
      let throwawayfilepath = path.join(__dirname, '../mock/modelthrowaway1.json');
      newLOWKIE.connect(throwawayfilepath)
        .then(() => { 
          expect(newLOWKIE.model.bind(newLOWKIE)).to.throw('model name must be a valid string');
          removeTestDB(throwawayfilepath);
          done()
        })
        .catch(done);
    });
    it('should throw an error if schema isnt an instance of lowkie schema', function (done) {
      let newLOWKIE = new lowkieClass({});
      let throwawayfilepath = path.join(__dirname, '../mock/modelthrowaway2.json');
      let model = 'testmodel';
      newLOWKIE.connect(throwawayfilepath)
        .then(() => { 
          expect(newLOWKIE.model.bind(newLOWKIE, model, { name:String,description:String, })).to.throw(`${model} must be an instance of a lowkieSchema`);
          removeTestDB(throwawayfilepath);
          done();
        })
        .catch(done);
    });
    it('should register models globally', () => {
      let goodModelSchema = lowkie.Schema(testUserModelScheme);
      lowkie.model('goodModel', goodModelSchema);
      // console.log(lowkie.models);
      expect(Object.keys(lowkie.models)).to.have.length.above(0);
    });
  });
  after('remove test schema db', () => {
    removeTestDB(testSchemaDBPath, true);
  });
});