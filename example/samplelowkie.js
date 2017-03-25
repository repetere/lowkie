const lowkie = require('../index');
const lowkie2 = require('../index');
const lowkie3 = require('../index');

// console.log( lowkie );
// console.log(lowkie === lowkie2);
lowkie.connect();
lowkie.on('connecting',(connectdata)=>{
	console.log('now trying to connect to db');
});