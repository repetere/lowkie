'use strict';
const loki = require('lokijs');
const path = require('path');
// // var loki = require('../src/lokijs.js');
const lokiFSAdapter = require('lokijs/src/loki-fs-structured-adapter.js');
// const adapter = new lfsa();
const dbname = path.join(__dirname, '/test/test.lokidb.json');

// const db = new loki(dbname, {
// // });
// //     {
//   autoload: true,
//   autoloadCallback : loadHandler,
//   autosave: true, 
//   autosaveInterval: 10000, // 10 seconds
//   adapter,
//   // adapter: lfsa,
//   // adapter: idbAdapter
// }); 

function loadHandler() {
  // if database did not exist it will be empty so I will intitialize here
  console.log('GOT TO LOAD CALLBACK');
  var coll = db.getCollection('children');
  if (coll === null) {
    coll = db.addCollection('children');
  }
}
// db.addCollection('children');
// db.saveDatabase();

// db.loadDatabase(dbname, (err, data) => {
//   console.log(err, data);

//   // Create the database:
//   // const db = new loki('loki.json');
//   console.log({ db, adapter, });

//   // Pass the filename where to persist data
//   // Create a collection:
//   var children = db.getCollection('children');
//   // Insert a document:
//   children.insert({ name:'Sleipnir', legs: 8, });
//   children.insert({ name:'Jormungandr', legs: 0,  });
//   children.insert({ name:'Hel', legs: 2, });
//   // Retrieve documents:
//   console.log('children.get(1)', children.get(1)); // returns Sleipnir
//   children.find( { 'name':'Sleipnir', } );
//   children.find( { legs: { '$gt' : 2, }, } );

//   console.log({ children, });
//   // Create a dynamic view:
//   var legs = children.addDynamicView('legs');
//   legs.applyFind( { legs: { '$gt' : 2, }, });
//   legs.applySimpleSort('legs');
//   legs.data();
//   // console.log({ legs, db });

//   // MapReduce:
//   children.mapReduce(
//     function( obj ){
//       return obj.legs; 
//     },
//     function( array ) {
//       var sum = 0;
//       for (var i=0; i < array.length; i++ ){
//         sum += array[i];
//       }
//       return ( sum / array.length ).toFixed(2);
//     });
// });



// Save : will save App/Key/Val as 'finance'/'test'/{serializedDb}
// if appContect ('finance' in this example) is omitted, 'loki' will be used
// var idbAdapter = new lokiIndexedAdapter('finance');
console.log({ dbname, });
let i = 0;
var fsAdapter = new lokiFSAdapter(dbname);
var db = new loki(dbname, {
  autoload: true,
  autoloadCallback : loadHandler,
  autosave: true, 
  autosaveInterval: 5000, // 10 seconds
//   adapter,
//   // adapter: lfsa,
//   // adapter: idbAdapter
  
  adapter: fsAdapter,
});
var coll = db.addCollection('users');
coll.insert({
  test: 'val',
  randdata: Math.random(),
  createdat:new Date(),
});

let t = setInterval(() => { 
  coll.insert({
    test: 'timed insert_'+i,
    randdata: Math.random(),
    createdat:new Date(),
  });
  console.log({ i });
  i++;
  
  if (i % 5 === 0) {
    console.log("db.getCollection('testColl').data()",db.getCollection('testColl'));
  }
}, 1000);

// db.saveDatabase();  // could pass callback if needed for async complete


// // Load database
// var fsAdapter = new LokiIndexedAdapter('finance');
// var db = new loki('test', { adapter: fsAdapter });
// db.loadDatabase({}, function(err, data) {
//   console.log('done', { err, data, });
//   let coll = db.addCollection('testColl');
//   let t = setInterval(() => { 
//     coll.insert({
//       test: 'timed insert_'+i,
//       randdata: Math.random(),
//       createdat:new Date(),
//     });
//     i++;
//     if (i % 5 === 0) {
//       console.log("db.getCollection('testColl').data()",db.getCollection('testColl'));
//     }
//   }, 1000);
// });

/*
// Get database list
var fsAdapter = new LokiIndexedAdapter('finance');
fsAdapter.getDatabaseList(function(result) {
  // result is array of string names for that appcontext ('finance')
  result.forEach(function(str) {
    console.log(str);
  });
});

// Delete database
var fsAdapter = new LokiIndexedAdapter('finance');
fsAdapter.deleteDatabase('test'); // delete 'finance'/'test' value from catalog

// Delete database partitions and/or pages
// This deletes all partitions or pages derived from this base filename
var fsAdapter = new LokiIndexedAdapter('finance');
fsAdapter.deleteDatabasePartitions('test'); 

// Summary
var fsAdapter = new LokiIndexedAdapter('finance');
fsAdapter.getCatalogSummary(function(entries) {
  entries.forEach(function(obj) {
    console.log("app : " + obj.app);
    console.log("key : " + obj.key);
    console.log("size : " + obj.size);
  });
});
*/
