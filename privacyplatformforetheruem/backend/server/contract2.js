var fs = require('fs')
var solc = require('solc')
var Web3 = require('web3')

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8555"));

}

var deploy = function(account, name, fieldtobeEnc, initval, callback) {
		
	console.log("DEPLYING:: ", name, fieldtobeEnc, initval);

	web3.personal.unlockAccount(account, "des1gn_project", 3600);
	var balanceWei = web3.eth.getBalance(account).toNumber();
	var balance = web3.fromWei(balanceWei, 'ether');
	console.log("BALANCE: ", balance);
	var source = fs.readFileSync('../templates/' + name + '.sol', 'utf8');
	var compiledContract = solc.compile(source, 1);  //web3.eth.compile.solidity(source);	
	var abi = compiledContract.contracts[name].interface;
	var bytecode = compiledContract.contracts[name].bytecode;
	//var gasEst = web3.eth.estimateGas({data: bytecode});
	gasEst = 2000000;
	console.log("GAS: ", gasEst);
	var MyContract = web3.eth.contract(JSON.parse(abi));

	var contractReturned = MyContract.new(initval, {
		from:account, 
		data:bytecode,
		gas:gasEst}, function(err, myContract){
			if(err){
				console.log(err);
				return callback("Failed", err);
			}
		
			if(!myContract.address){
				console.log("hash: ", myContract.transactionHash)
				return callback("InProgress", myContract.transactionHash);
			}
			else {//if(myContract.address){
				console.log("address: ", myContract.address);
				return callback("Deployed", {txNumber: myContract.transactionHash, address: myContract.address});			
			}
	});
}

var load = function(account, name, address, callback) {

	web3.personal.unlockAccount(account, "des1gn_project", 3600);
	var source = fs.readFileSync('../templates/' + name + '.sol', 'utf8');
	var compiledContract = solc.compile(source, 1);  //web3.eth.compile.solidity(source);	

	var abi = compiledContract.contracts[name].interface;
	var conClass = web3.eth.contract(JSON.parse(abi));
	var con = conClass.at(address);
	return callback(null, con);
}


var getValue = function(account, con, field, callback){
	var err;

	if(field === 'balance') 
		value = con.getBalance();
	else
		err = "Field does not exist";
	
	value = con.getBalance();
	return callback(null, value);
}

var addToField = function(account, con, field, addValue, callback){
	var err;
    
	if(field === 'balance') 
        txNumber = con.addToBalance(addValue, {from: account, gas: 50000});
    else 
        err = "Field does not exist";

	return callback(null, txNumber);
}

var mul = function(account, con, a, b, callback){
	var err;
    
    m = con.mul(a, b, {from: account, gas: 50000});

	return callback(null, m);
}

module.exports = {
	deploy: deploy,
	load: load,
	getValue: getValue,
	addToField: addToField
}
