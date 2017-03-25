'use strict';
const path = require('path');
const fs = require('fs');
const loki = require('lokijs');
const lokiFSAdapter = require('lokijs/src/loki-fs-structured-adapter.js');
const dbname = path.resolve('./test/working.lokidb.json');
const adapter = new lokiFSAdapter(dbname);
const db = new loki(dbname, {
  // autoload: true,
  autoloadCallback : loadHandler,
  autosave: true, 
  autosaveInterval: 5000, // 5 seconds
  adapter,
}); 
let i = 0;
console.log({ dbname });
if (fs.existsSync(dbname)) {
  db.loadDatabase({}, (err, data) => {
    console.log('existsSync loadDatabase done', { err, data, });
  });
  console.log('in EXISTS', { db });
  loadHandler();
} else {
  db.saveDatabase((err, saved) => {
    console.log({ err, saved });  
    db.loadDatabase(dbname, (err, data) => {
      console.log('saveDatabase loadDatabase done', { err, data, });
    });
  });
  console.log('in DOES NOT EXISTS');
}
  // could pass callback if needed for async complete
function loadHandler() {
  // if database did not exist it will be empty so I will intitialize here
  console.log('GOT TO LOAD CALLBACK');
  var coll = db.getCollection('children');
  if (coll === null) {
    coll = db.addCollection('children');
  }
  let t = setInterval(() => { 
    coll.insert({
      test: 'timed insert_'+i,
      randdata: Math.random(),
      createdat:new Date(),
    });
    i++;
    if (i % 5 === 0) {
      console.log("db.getCollection('children').data()",db.getCollection('children'));
    }
  }, 1000);
}

// Load database
// var fsAdapter = new LokiIndexedAdapter('finance');
// var db = new loki('test', { adapter: fsAdapter });
db.loadDatabase({}, function(err, data) {
  console.log('done', { err, data, });
});

// process.on('exit', (code) => {
process.on('beforeExit', (code) => {
  console.log(`About to exit with code: ${code}`);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT.  Press Control-D to exit.',{db});
    process.exit();
  db.saveDatabase((err, saved) => {
    console.log({ err, saved });  
    process.exit();
  });
});