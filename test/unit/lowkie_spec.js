'use strict';
/*jshint expr: true*/
const path = require('path'),
  // fs = require('fs-extra'),
  chai = require('chai'),
  expect = require('chai').expect;


describe('lowkie', function () {
	describe('#indexOf()', function () {
		it('should return -1 when the value is not present', function () {
			expect([1, 2, 3].indexOf(5)).to.equal(-1 );
			// should.equal(-1, [1, 2, 3].indexOf(0));
		});
	});
});