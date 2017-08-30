var http = require('http');
var request = require('request');

var url = 'ethnode1.canadaeast.cloudapp.azure.com'
var port = 3001
function getReq(p, callback) {
	return http.get({
		host: url,
		port: port,
		path: p
	}, function(response) {
		var body = '';
		response.on('data', function(d) {
			body += d;
		});

		response.on('end', function() {
			//var parsed = JSON.parse(body);
			callback(body);
		});
	});
}

function printResponse(input) {
	console.log(input);
}

function postReq(p, jsondata, callback) {
	console.log(url + ':' + port + p)
	request({
    		url: 'http://' + url + ':' + port + p,
   		method: "POST",
    		json: true,   // <--Very important!!!
    		body: jsondata
	}, function (error, response, body){
    		callback(error + '\n' + response + '\n' + body);
	});
}

getReq('/', printResponse);
//getReq('/deploy_contract', printResponse);

var data = {a: "blah", b: "blah" };
postReq('/deploy_contract', data, printResponse);


