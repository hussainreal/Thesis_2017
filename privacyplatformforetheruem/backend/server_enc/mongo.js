var MongoClient = require('mongodb').MongoClient;
var db;
MongoClient.connect("mongodb://localhost:27017/ethdb", function(err, _db) {

	if(err) return console.dir(err);
	console.log("Connected to mongo on port 27017!");
	db = _db;
	db.createCollection('contracts', {strict:true}, function(err, collection) {});

});       

var insert = function(collectionName, entry){
	var col = db.collection(collectionName);
	col.insert(entry, {w:1}, function(err, result) {
		if(err) console.log(err); 
		//console.log(result);
	});
}

var update = function(collectionName, key, value, updatefields){
	var col = db.collection(collectionName);
	col.update({[key]: value}, {$set: updatefields} , {w:1}, function(err, result) {
        	if(err) console.log(err);
        	//console.log(result);
    	});
}

var getNumContractsDeployed = function(callback){
	var col = db.collection('contracts');
	col.count({status: "Deployed"}, function(err, count){
		return callback(err, count);
	});	
}

var getContract = function(key, value, callback){
	var col = db.collection('contracts');

	if(key !== 'txNumber' && key !== 'address' && key !== 'all')
		return callback("Invalid key in query", null);

	if(key === 'all'){
		col.find().toArray(function(err, doc){
			if(err) return callback(err, null);
        	return callback(null, doc);
		})
	}
	else {
		col.findOne({[key]: value}, function(err, doc){
			if(err) return callback(err, null);
			if(!doc) return callback("No contract found with "+key+": "+value, null);
	
			return callback(err, {txNumber: doc.txNumber, status: doc.status, name: doc.name, address: doc.address, python_time: doc.python_time, blockchain_time: doc.blockchain_time});
		})
	}
}


module.exports = {
	insert: insert,
	update: update,
	getNumContractsDeployed: getNumContractsDeployed,
	getContract: getContract
}

