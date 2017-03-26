const path = require('path');
const lowkie = require('../index');
const lowkie2 = require('../index');
const lowkie3 = require('../index');

console.log( 'lowkie.connection', lowkie.connection );
// console.log(lowkie === lowkie2);
lowkie.connect(path.join(__dirname, './sampledb.json'));
lowkie.connection.on('connecting', (connectdata)=>{
  console.log('now trying to connect to db',connectdata);
});
lowkie.connection.once('connected', (connectdata)=>{
  console.log('now connected to db');
});

let t = setInterval(() => {
  console.log('running process');
}, 5000);