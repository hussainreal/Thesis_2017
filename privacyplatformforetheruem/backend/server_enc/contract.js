var fs = require('fs')
var solc = require('solc')
var Web3 = require('web3')
var enc = require('./encryption');
var BigNumber = require('bignumber.js');

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8555"));
	//FIXME: port harcoded , 8080 or 8555
}

//pubkeys = {"g": "2869930398", "n": "2869930397",  "n_sq": "8236500483624577609"};
//privkeys = {"l": "2869822716",  "m": "1006971613"};

pubkeys = {
"g": "117724361726052232286642729503619885226396848298440290194474368106181877843301454349676344086382538003780399137832758867778222252201458886767547437337543045586657569159374425258039121862112545733028126116907766250403035801176460752912327774508255666696312630982168986041970059274372378012061526901950296772972",
"n": "117724361726052232286642729503619885226396848298440290194474368106181877843301454349676344086382538003780399137832758867778222252201458886767547437337543045586657569159374425258039121862112545733028126116907766250403035801176460752912327774508255666696312630982168986041970059274372378012061526901950296772971",
"n_sq": "13859025343806391724289012340636007517856812470399552782849410723186738408224943862229045082026573808542645768813291683672590022400753770597376594265425755418649862946024287446851755443281965084202056749045569931049723621466662928679048901126827007182697456876001147891347861597443262827607112497890231245296538525850468305542969877113479098725813447056986973977116083993580657945506068423608861988928447530897456275846901311444559511555664329390030863183440666969381620083548841652072533980932901680931325634535476046500260807848129059854742673946241513261640462679464533013836908596029514060149476342461096316166841"
};

privkeys = {
"l": "117724361726052232286642729503619885226396848298440290194474368106181877843301454349676344086382538003780399137832758867778222252201458886767547437337543023412637020164016214793318994111541214747403004456459008586853011775269020476296537422383326827290254530636376268359138571217398562453140332217601033219432",
"m": "47980525443061876020527034016411441227194643960510513681010937410836364029459946692501328682288988879636933490245011435684998877231847088799294115530169680532159764430125011371702310221053393033596079811897509778462503208137703278639186152516671532389276888159878118655619742545737851891896315730683541788480"
};


var deploy = function(account, name, fieldtobeEnc, initval, callback) {
		
	console.log("********** DEPLOYING CONTRACT **********");
	console.log("CONTRACT NAME: ", name);
	console.log("FIELDS REQUESTED TO BE ENCRYPTED: ", fieldtobeEnc);
	console.log("VALUE OF FIELD: ", initval);

	console.log("ACCOUNT NUMBER: ", web3.eth.coinbase);
	//FIXME: don't hardcode account password	
	web3.eth.defaultAccount = web3.eth.coinbase;
	web3.personal.unlockAccount(web3.eth.coinbase, "des1gn_project2", 3600);
	//web3.personal.unlockAccount(account, "des1gn_project2", 3600);
	var balanceWei = web3.eth.getBalance(account).toNumber();
	var balance = web3.fromWei(balanceWei, 'ether');
	console.log("ACCOUNT BALANCE: ", balance);
	var source = fs.readFileSync('../templates/' + name + '.sol', 'utf8');
	//var compiledContract = solc.compile(source, 1);  //web3.eth.compile.solidity(source);	
	var compiledContract = web3.eth.compile.solidity(source);	
	var MyContract = web3.eth.contract(compiledContract[Object.keys(compiledContract)].info.abiDefinition);
	console.log("ENCRYPTING FIELD ...");
	enc.encryptNum({"public_key": pubkeys, "number": initval}, function(err, encVal, pythontime){
		console.log("ENCRYPTED VALUE: " + encVal)
		if(encVal == null)
			return callback("Paillier Server error: Returned null");

		console.log("RETRIEVING MONTGOMERY PARAMETERS ...");
		enc.extraParamMontgo({"p": pubkeys['n_sq']}, function(err, res){
			if(res == null)
				return callback("Montgomery Server error: Returned null");
			var contractReturned = MyContract.new(encVal, res['R'], res['q'], res['q_prime'], res['digitsinR'], {
			from:account, 
			//data:bytecode,
			data:compiledContract[Object.keys(compiledContract)].code,
			gas:6000000
			//gas:gasEst+5000000
			}, function(err, myContract){
				if(err){
					console.log("ERROR");
					console.log(err);
					return callback("Failed", err);
				}
			
				if(!myContract.address){
					console.log("******************************");
					console.log("CONTRACT SENT!");
					console.log("TRANSACTION NUMBER: ", myContract.transactionHash)
					return callback("InProgress", {txNumber: myContract.transactionHash, pythontime: pythontime+res['python_time']});
				}
				else {//if(myContract.address){
					console.log("CONTRACT DEPLOYED!");
					console.log("CONTRACT ADDRESS: ", myContract.address);
					return callback("Deployed", {txNumber: myContract.transactionHash, address: myContract.address, pythontime: pythontime+res['python_time']});			
				}
			});
		});	
	});
}

var load = function(account, name, address, callback) {

	web3.personal.unlockAccount(account, "des1gn_project2", 3600);
	var source = fs.readFileSync('../templates/' + name + '.sol', 'utf8');
	var compiledContract = web3.eth.compile.solidity(source);
	var abi = compiledContract[Object.keys(compiledContract)].info.abiDefinition;
	var con = web3.eth.contract(abi).at(address);	

	return callback(null, con);
}


var getValue = function(account, con, field, callback){
	var err;

	if(field === 'balance'){ 
		var value = con.getBalance();//function(err, value){
		if(value == null)
			return callback("Blockchain returned null", null, null, null);
		enc.decryptNum({"public_key": pubkeys, "private_key": privkeys, "number": value}, function(err, decVal, pythontime){
			return callback(null, decVal, value, pythontime);
		})
	}
	else{
		err = "Field does not exist";
		return callback(err, null, null, null);
	}
}

var addToField = function(account, con, field, addValue, callback){
	var err;
    
	if(field === 'balance'){
		console.log("ENCRYPTING VALUE TO BE ADDED ...");
		enc.encryptNum({"public_key": pubkeys, "number": addValue}, function(err, encVal, pythontime){
			console.log(encVal);
			console.log("PERFORMING HOMOMORPHIC ADD...");
			var result = con.addToBalance(encVal);
			
			console.log("RESULTING SUM:");
			console.log(result);
			if(result == null)
				return callback("Blockchain err in addToBalance", null, null, null);
			
			var txnum = con.setBalance(result, {from:account, gas: 1000000});
			//console.log("txnumber for set: ", txnum);
			//console.log("ENC VSLUE AFTER SET: ", encVal);
			if(txnum == null)
                return callback("Blockchain err in setBalance", null, null, null);

			return callback(null, txnum, encVal, pythontime);
    	})
	}
	else{ 
        err = "Field does not exist";
		return callback(err, null);
	}
}

module.exports = {
	deploy: deploy,
	load: load,
	getValue: getValue,
	addToField: addToField
}
