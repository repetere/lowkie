'use strict';
const crypto = require('crypto');

/**
 * helper class for generating Ids
 * 
 * @class ObjectId
 */
class ObjectId{
  /**
   * generates a unique ID
   * 
   * @static
   * 
   * @memberOf ObjectId
   */
  static createId() {
    let _id = crypto.createHash('md5').update(`${new Date().valueOf}${Math.random()}`).digest('hex');
    return _id;
  }
  constructor() {
  }
}
module.exports = ObjectId;