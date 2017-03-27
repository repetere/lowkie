const path = require('path');
const fs = require('fs');
const lokiFSAdapter = require('lokijs/src/loki-fs-structured-adapter.js');
const dbname = path.resolve('./filetest.lokidb.json');
const adapter = new lokiFSAdapter(dbname);
let i = 0;

const loki = require('lokijs');
// const db = new loki(dbname, {
//   // autoload: true,
//   autoloadCallback: loadHandler,
//   autosave: true,
//   autosaveInterval: 5000, // 5 seconds
//   adapter,
// });

// function loadHandler() {
//   // if database did not exist it will be empty so I will intitialize here
//   console.log('GOT TO LOAD CALLBACK');
//   var coll = db.getCollection('children');
//   if (coll === null) {
//     coll = db.addCollection('children');
//   }
//   let t = setInterval(() => { 
//     coll.insert({
//       test: 'timed insert_'+i,
//       randdata: Math.random(),
//       createdat:new Date(),
//     });
//     i++;
//     if (i % 5 === 0) {
//       console.log("db.getCollection('children').data()",db.getCollection('children'));
//     }
//   }, 1000);
// }

// var users = db.addCollection('users');
// users.insert({
//   name: 'joe'
// });
// users.insert({
//   name: 'john'
// });
// users.insert({
//   name: 'jack'
// });
// console.log({users});
// db.saveDatabase(() => {
//   console.log('saved DB', { db });

//   const db2 = new loki(dbname, {
//     // autoload: true,
//     // autoloadCallback : loadHandler,
//     autosave: true, 
//     autosaveInterval: 5000, // 5 seconds
//     adapter,
//   });


//   db2.loadDatabase({}, function () {
//     console.log('LOADED DB2', { db2 });
//     var users2 = db2.getCollection('users')
//     // console.log(Object.keys(users2));
//     console.log('users2.data',users2.data);
//   });
// });

setTimeout(() => {
  console.log('try to load from disk');
  const db3 = new loki(dbname, {
    // autoload: true,
    // autoloadCallback : loadHandler,
    autosave: true, 
    autosaveInterval: 5000, // 5 seconds
    adapter,
  });


  db3.loadDatabase({}, function () {
    console.log('LOADED DB3', { db3 });
    var users3 = db3.getCollection('users')
    // console.log(Object.keys(users3));
    console.log('users3.data',users3.data);
  });
}, 5000);

