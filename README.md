# Lowkie
[![Build Status](https://travis-ci.org/typesettin/lowkie.svg?branch=master)](https://travis-ci.org/typesettin/lowkie) [![NPM version](https://badge.fury.io/js/lowkie.svg)](http://badge.fury.io/js/lowkie) [![Coverage Status](https://coveralls.io/repos/github/typesettin/lowkie/badge.svg?branch=master)](https://coveralls.io/github/typesettin/lowkie?branch=master)  [![Join the chat at https://gitter.im/typesettin/lowkie](https://badges.gitter.im/typesettin/lowkie.svg)](https://gitter.im/typesettin/lowkie?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

### Description
Lowkie is a lokijs object modeling tool designed to work in an asynchronous environment.

<p style="text-align:center;"><img src="https://raw.githubusercontent.com/typesettin/lowkie/master/doc/lowkie.png" alt="Promisie Logo" width="300px" height="auto" style="margin:auto; text-align:center;"></p>


### Installation
```sh
$ npm i lowkie
```

### [Full Documentation](https://github.com/typesettin/lowkie/blob/master/doc/api.md)

### Usage (basic)
```javascript
//lowkie singleton
const lowkie = require('lowkie');

//connect to lowkie (includes loki connection configuration), options can include other loki adapters besides structured file adapters
lowkie.connect(path.join(__dirname, './sampledb.json'),options)
  .then((db) => { 
    console.log('connected db');
  })
  .catch(e => {
    console.log('connection error', e);
  });

//listen for connection errors
lowkie.connection.on('connectionError', (e)=>{
  console.log('error connecting to the db',e);
});

//listen for connecting status, dbname is the path to the db json file
lowkie.connection.on('connecting', (dbname, options)=>{
  console.log('now trying to connect to db');
});

//once connected, create models, query the db, etc
lowkie.connection.once('connected', (db, options)=>{
  console.log('now connected to db');
  //create a new schema
  const UserSchema = lowkie.Schema({
    email:String,
    username:String,
    age:Number,
  });
  //register db models, each model is a proxied loki collection with additional helpers
  const User = lowkie.model('User',UserSchema);

  //write data to db
  User.insert({
    email:'test@domain.com',
    username:'testuser',
    age:30,
    invalidProp:'whatever', //removes invalid schema props on creates
  })
    .then(newuser => {
      //created db
      /*
      {
        "_id":"fbd8080a9272ecaa15d1bb6d0f4b3314",
        "email":"test@domain.com",
        "username":"testuser",
        "age":30,
        "meta":{
          "revision":0,
          "created":1490576236063,
          "version":0
        },
        "$loki":201
      }
      */
      console.log({ newuser });
    })
    .catch(e => { 
      console.log(e);
    });
  
  //insert multiple documents
  User.insert([
    {
      email:'john@domain.com',
      username:'jsmith',
      age:37,
    },
    {
      email:'jane@domain.com',
      username:'jdoe',
      age:45,
    },
    {
      email:'chris@domain.com',
      username:'clane',
      age:17,
    },
  ])
    .then((newusers)=>{
      console.log(newusers);
    })
    .catch(e =>{
      console.log(e);
    })
  
  //query loki for data
  let userQueryResults = User.find({ id: { '$gte': 1 } });
  console.log({userQueryResults}) //result of user query
});

```
### Development
*Make sure you have grunt installed*
```sh
$ npm i -g grunt-cli jsdoc-to-markdown
```

For generating documentation
```sh
$ grunt doc
$ jsdoc2md lib/**/*.js index.js > doc/api.md
```
### Notes
* Check out [https://github.com/typesettin/lowkie](https://github.com/typesettin/lowkie) for the full Lowkie Documentation

### Testing
```sh
$ npm i
$ grunt test
```
### Contributing
License
----

MIT