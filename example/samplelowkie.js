const path = require('path');
const lowkie = require('../index');
const lowkie2 = require('../index');
const lowkie3 = require('../index');
const randomName = [ 'princess', 'prince', 'king', 'queen', 'pauper', 'jester' ];
const getName = () => {
  let randomIndex = Math.floor(Math.random() * 6) + 1;
  return randomName[ randomIndex ];
};
lowkie.connect(path.join(__dirname, './sampledb.json'))
  .then((db) => { 
    // console.log('connected db', db);
    console.log('connected db');
  })
  .catch(e => {
    console.log('connection error', e);
  });
lowkie.connection.on('connectionError', (e)=>{
  console.log('error connecting to the db',e);
});
lowkie.connection.on('connecting', (connectdata)=>{
  console.log('now trying to connect to db');
});
lowkie.connection.once('connected', (connectdata)=>{
  console.log('now connected to db');
  var kittySchema = lowkie.Schema({
    name: String,
    entitytype: {
      type: String,
      default:'cat',
    },
    description:String,
  });
  let Kitten = lowkie.model('kitten', kittySchema);
  Kitten.insert({
    name: getName() + Math.random(),
    id: new Date().valueOf() + Math.random(),
    wrongd: 'not in schema',
    entitytype:'kat',
    shoulnntsave: 'not good',
    description: 10983021,
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
    Kitten.insert({
      name: getName() + Math.random(),
      id: new Date().valueOf() + Math.random(),
      wrongd: 'not in schema',
      entitytype:'kat',
      shoulnntsave:'not good',
    });
    var results = Kitten.find({ id: { '$gte': 1 } });
    console.log({results})
  }, 5000);
});

