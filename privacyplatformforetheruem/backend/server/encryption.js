var request = require('request-json');
var client = request.createClient('http://localhost:5000/');

var generateKeys = function(callback){
	client.get('/generatekeys', function(err, res, body){
		if(err) return callback(err, null);
		else{
			callback(null, body);
		}
	})
}
	
var encryptNum = function(data, callback){
	client.post('/encrypt', data, function(err, res, body){
		if(err) return callback(err, null);
		else{
			console.log(body);
			callback(null, body);
		}
	})
}
	
var decryptNum = function(data, callback){
	client.post('/decrypt', data, function(err, res, body){
		if(err) return callback(err, null);
		else{
			console.log(body);
			callback(null, body);
		}
	})	
}
	

var toMontgo = function(data, callback){
	client.post('/to_montgo', data, function(err, res, body){
		if(err) return callback(err, null);
		else{
			console.log(body);
			callback(null, body);
		}
	})

}
	
var fromMontgo = function(data, callback){
	client.post('/from_montgo', data, function(err, res, body){
		if(err) return callback(err, null);
		else{
			console.log(body);
			callback(null, body);
		}
	})

}
	
var extraParamMontgo = function(data, callback){
	client.post('/extraparam_montgo', data, function(err, res, body){
		if(err) return callback(err, null);
		else{
			console.log(body);
			callback(null, body);
		}
	})

}
	
module.exports = {
	generateKeys: generateKeys,
	encryptNum: encryptNum,
	decryptNum: decryptNum,
	toMontgo: toMontgo,
	fromMontgo: fromMontgo,
	extraParamMontgo: extraParamMontgo
}
