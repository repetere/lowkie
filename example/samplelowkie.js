const path = require('path');
const lowkie = require('../index');
const lowkie2 = require('../index');
const lowkie3 = require('../index');

// console.log( 'lowkie.connection', lowkie.connection );
// console.log(lowkie === lowkie2);
lowkie.connect(path.join(__dirname, './sampledb.json'));
lowkie.connection.on('connecting', (connectdata)=>{
  console.log('now trying to connect to db');
});
lowkie.connection.once('connected', (connectdata)=>{
  console.log('now connected to db');
  var kittySchema = lowkie.Schema({
    name: String,
  });
  let Kitten = lowkie.model('kitten', kittySchema);
  Kitten.insert({
    name: 'princess' + Math.random(),
    id: new Date().valueOf() + Math.random(),
  })
    .then(newkitty => {
      console.log({ newkitty });
    })
    .catch(e => { 
      console.log(e);
    });
  // console.log(lowkie.db);
  let t = setInterval(() => {
    console.log('running process');
  }, 5000);
});

