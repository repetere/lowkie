'use strict';
const loki = require('lokijs');
// Create the database:
const db = new loki('loki.json');

// Pass the filename where to persist data
// Create a collection:
var children = db.addCollection('children');
// Insert a document:
children.insert({ name:'Sleipnir', legs: 8, });
children.insert({ name:'Jormungandr', legs: 0 ,  });
children.insert({ name:'Hel', legs: 2, });
// Retrieve documents:
children.get(1); // returns Sleipnir
children.find( { 'name':'Sleipnir', } );
children.find( { legs: { '$gt' : 2, }, } );

// Create a dynamic view:
var legs = children.addDynamicView('legs');
legs.applyFind( { legs: { '$gt' : 2, }, });
legs.applySimpleSort('legs');
legs.data();

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