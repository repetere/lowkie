'use strict';
/*jshint expr: true*/
const path = require('path');
const events = require('events');
const chai = require('chai');
const expect = require('chai').expect;
// let lowkie = require('../../index');
let lowkieObjectId = require('../../lib/object_id');


describe('ObjectId', function () {
	describe('Represents a class for generating ObjectId', function () {
    it('should export a new class', function () {
      let lowkieObjectIdInstance = new lowkieObjectId();
      expect(lowkieObjectIdInstance).to.be.instanceof(lowkieObjectId);
    });
    it('should generate unique ids', () => {
      expect(lowkieObjectId.createId()).to.not.equal(lowkieObjectId.createId());
    });
    it('should have a static method for generating ids', () => {
      // let lowkieObjectIdInstance = new lowkieObjectId();
      expect(lowkieObjectId.createId).to.be.a('function');
      expect(lowkieObjectId.createId()).to.be.a('string');
    });
    // it('should export schema types', () => {
    //   expect(lowkie.Schema.Types).to.be.an('object');
    //   expect(lowkie.Schema.Types).to.have.property('String');
    //   expect(lowkie.Schema.Types.String).to.deep.equal(String);
    //   expect(lowkie.Schema.Types).to.have.property('ObjectId');
    // });
    // it('should have connection that emit events', () => {
    //   expect(lowkie.connection).to.be.an.instanceof(events.EventEmitter);
    // });
    // // it('should export instance of lowkie class proxy', () => {
    // //   expect(lowkie).to.be.an.instanceof(Proxy);
    // // });
  });
});