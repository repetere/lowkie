const fs = require('fs-extra');

module.exports = (dbpath, removeAll) => {
  if (removeAll) {
    fs.removeSync(dbpath + '.0');
  }
  fs.removeSync(dbpath);
};