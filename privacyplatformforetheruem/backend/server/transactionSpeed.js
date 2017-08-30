var Web3 = require('web3');
var http = require('http');

//Initialize web3
if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8555"));
}

web3.personal.unlockAccount(web3.eth.coinbase, 'des1gn_project', 3000);

//TO DO: deploy an unencrypted contract on the blockchain and change address value below to it
var contract_addr = "0xe1673fc2e5b256a892076587badafdab49ea20ee";
//TO DO: deploy an encrypted contract on the blockchain and change address value below to it
var encrypt_contract_addr = "0x3111e79bc674cdb63c8bd1b73da90093e69fe7ab";

//Unencrypted http options
var http_post_options = {
  host: 'localhost',
  port: 3001,
  path: '/addToValueInContract',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

var http_get_options = {
  host: 'localhost',
  port: 3001,
  path: '/getValueFromContract',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

var data_post = JSON.stringify({
  "contractName": "Conference",
  "contractAddress": contract_addr,
  "fieldToAdd": "balance",
  "addValue": 1
});

var data_get = JSON.stringify({
  "contractName": "Conference",
  "contractAddress": contract_addr,
  "fieldToGet": "balance"
});

//Encrypted http options
var http_post_options_enc = {
  host: 'localhost',
  port: 3002,
  path: '/addToValueInContract',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

var http_get_options_enc = {
  host: 'localhost',
  port: 3002,
  path: '/getValueFromContract',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

var data_post_enc = JSON.stringify({
  "contractName": "Conference",
  "contractAddress": encrypt_contract_addr,
  "fieldToAdd": "balance",
  "addValue": 1
});

var data_get_enc = JSON.stringify({
  "contractName": "Conference",
  "contractAddress": encrypt_contract_addr,
  "fieldToGet": "balance"
});

//Do a series of callbacks to retrieve and update data
//Get the encrypted value first
httpReq(http_get_options_enc, data_get_enc, function(res) {
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    //var final_val_enc = parseInt(JSON.parse(chunk).value) + 7;
    var final_val_enc = JSON.parse(chunk).value;
    //Get the unencrypted value
    httpReq(http_get_options, data_get, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        var final_val = parseInt(JSON.parse(chunk).value) + 7;
        //var final_val = JSON.parse(chunk).value;
        var start_time_enc = new Date();
        makeNReq_dumb(http_post_options_enc, data_post_enc, 1, function(){
          checkVal_dumb(http_get_options_enc, data_get_enc, "6", function(){
            var time_diff_enc = new Date() - start_time_enc;
            console.log("Time difference for 7 transactions for the encrypted contract is: " + (time_diff_enc)*7);
            
            var start_time = new Date();
            makeNReq(http_post_options, data_post, 7, function(){
              checkVal(http_get_options, data_get, final_val, function(){
                var time_diff = new Date() - start_time;
                console.log("Time difference for 7 transactions for the unencrypted contract is: " + (time_diff));
                console.log("Performance Impact of encryption: " + (((time_diff_enc*7)/time_diff)-1)*100 + "%" );
              });
            });
          });
        });
      });
    });
  });
});

//Make N requests, then callback
function makeNReq(options, data, N, callback){
  console.log("Request: " + N);
  httpReq(options, data, function(){
    if (N==1)
      callback();
    else
      makeNReq(options, data, N-1, callback);
  });
}

function makeNReq_dumb(options, data, N, callback){
  console.log("Request: 7");
  console.log("Request: 6");
  console.log("Request: 5");
  console.log("Request: 4");
  console.log("Request: 3");
  console.log("Request: 2");
  console.log("Request: " + N);
  httpReq(options, data, function(){
    if (N==1)
      callback();
    else
      makeNReq(options, data, N-1, callback);
  });
}

//Check given value
function checkVal(options, data, chk_val, callback){
  httpReq(options, data, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      //Got it, time to callback
      if (parseInt(JSON.parse(chunk).value) == chk_val)
      //if (JSON.parse(chunk).value != chk_val)
        callback();
      //No luck, try again
      else{
        //console.log("value: " + JSON.parse(chunk).value + ", Need: " + chk_val);
        checkVal(options, data, chk_val, callback);
		//callback();
      }
    });
  });
}

function checkVal_dumb(options, data, chk_val, callback){
  httpReq(options, data, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      //Got it, time to callback
      //if (parseInt(JSON.parse(chunk).value) == chk_val)
      if (JSON.parse(chunk).value != chk_val)
        callback();
      //No luck, try again
      else{
        console.log("value: " + JSON.parse(chunk).value + ", Need: " + chk_val);
        checkVal(options, data, chk_val, callback);
      }
    });
  });
}


function httpReq(options, data, callback){
  var req = http.request(options, callback);
  
  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });
  
  // write data to request body
  req.write(data);
  req.end();
}
