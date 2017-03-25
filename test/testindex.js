'use strict';
const loki = require('lokijs');
// var loki = require('../src/lokijs.js');
const lfsa = require('lokijs/src/loki-fs-structured-adapter.js');
const adapter = new lfsa();
const dbname = './test/test.lokidb.json';

const db = new loki(dbname, {
// });
//     {
  autoload: true,
  autoloadCallback : loadHandler,
  autosave: true, 
  autosaveInterval: 10000, // 10 seconds
  adapter,
  // adapter: lfsa,
  // adapter: idbAdapter
}); 

function loadHandler() {
  // if database did not exist it will be empty so I will intitialize here
  console.log('GOT TO LOAD CALLBACK');
  var coll = db.getCollection('children');
  if (coll === null) {
    coll = db.addCollection('children');
  }
}
db.addCollection('children');
db.saveDatabase();

db.loadDatabase(dbname, (err, data) => {
  console.log(err, data);

  // Create the database:
  // const db = new loki('loki.json');
  console.log({ db, adapter, });

  // Pass the filename where to persist data
  // Create a collection:
  var children = db.getCollection('children');
  // Insert a document:
  children.insert({ name:'Sleipnir', legs: 8, });
  children.insert({ name:'Jormungandr', legs: 0,  });
  children.insert({ name:'Hel', legs: 2, });
  // Retrieve documents:
  console.log('children.get(1)', children.get(1)); // returns Sleipnir
  children.find( { 'name':'Sleipnir', } );
  children.find( { legs: { '$gt' : 2, }, } );

  console.log({ children, });
  // Create a dynamic view:
  var legs = children.addDynamicView('legs');
  legs.applyFind( { legs: { '$gt' : 2, }, });
  legs.applySimpleSort('legs');
  legs.data();
  // console.log({ legs, db });

  // MapReduce:
  children.mapReduce(
    function( obj ){
      return obj.legs; 
    },
    function( array ) {
      var sum = 0;
      for (var i=0; i < array.length; i++ ){
        sum += array[i];
      }
      return ( sum / array.length ).toFixed(2);
    });
});