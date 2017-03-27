'use strict';
/*jshint expr: true*/
const path = require('path');
const events = require('events');
const chai = require('chai');
const expect = require('chai').expect;
const sinon = require('sinon');
let lowkieProxyHandler = require('../../lib/lowkieProxyHandler');

describe('ProxyHandler', function () {
  it('should be a proxy handler', () => {
    expect(lowkieProxyHandler).to.be.a('function');    
  });
  it('should return a proxy handler object', () => {
    expect(lowkieProxyHandler()).to.be.a('object');
  });
  it('should trap get property access', () => {
    let spy = sinon.spy();
    let testProxy = new Proxy(spy, lowkieProxyHandler);
    testProxy.someprop = '1234';
    testProxy.someprop = testProxy.someprop.toString();
    expect(lowkieProxyHandler().get).to.be.a('function');
    expect(testProxy.someprop).to.eql(spy.someprop);
    expect(lowkieProxyHandler().get(spy, 'someprop')).to.eql(spy.someprop);
  });
});