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
			client.post('/to_montgo', {"x": body.enc_num, "p": data.public_key.n_sq}, function(errr, ress, bd){
				callback(null, bd.montgo_num, body.python_time + bd.python_time);
			})
			
		}
	})
}

var decryptNum = function(data, callback){
    console.log("VALUE FROM CONTRACT:");
	console.log(data.number);
	console.log("DECRYPTING VALUE ...");
	client.post('/from_montgo', {"montgo_num": data.number, "p": data.public_key.n_sq}, function(errr, ress, bd){
                client.post('/decrypt', {"public_key": data.public_key, "private_key": data.private_key, "number": bd.num}, function(err, res, body){
  			    	if(err){
						console.log("failed decryption");
						 return callback(err, null, null);
					}
        			else{
						//console.log("successfule decrypt");
            			//console.log(body.dec_num);
            			callback(null, body.dec_num, body.python_time + bd.python_time);
        			}
    			})

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
		if(err){
			 return callback(err, null);
		}
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
