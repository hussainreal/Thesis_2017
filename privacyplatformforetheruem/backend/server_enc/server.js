var express = require('express');
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var mongo = require('./mongo');
var contract = require('./contract');
var enc = require('./encryption');
var transactions = require('./transactions');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};
app.use(allowCrossDomain);


//FIXME: temporarily using only one account
//var account = "0xe5f0367760b9cdeec8222ecf102f198ae390c3b8";
var account = "0x93e9e2d2e88b1dbb0b213d6935d577f5e0a2255f";
app.get('/', function (req, res) {
    res.send('Talking to backend!')
})

app.get('/get_transactions', function (req, res) {
    transactions.getTransactions(function(result){
      res.setHeader('Content-Type', 'application/json');
      res.send(result);
    });
})

app.post('/deployContract', function (req, res) {
	var start = Date.now();	

	if(!req.body.contractName || !req.body.fieldToBeEncrypted || !req.body.initialValue){
		res.status(400).json({error: "Missing/Incorrect inputs. Please check them."});
	}
	
	contract.deploy(account, req.body.contractName, req.body.fieldToBeEncrypted, req.body.initialValue, function(deployStatus, msg){
		
		if(deployStatus == "Failed"){
			res.setHeader('Content-Type', 'application/json');
			res.status(500).json({response: "Failed to deploy: " + msg});
		}
		else if(deployStatus == "InProgress"){
			var end = Date.now();
            var localtime = (end - start)/1000;
			console.log("ENCRYPTION TIME: ", msg.pythontime);
			console.log("BLOCKCHAIN TIME: ", localtime-msg.pythontime);
			console.log("TIME TAKEN TILL SEND CONTRACT: ", localtime);

			mongo.insert('contracts', {name: req.body.contractName, status: deployStatus, txNumber: msg.txNumber, address: '0', python_time: msg.pythontime, blockchain_time: localtime-msg.pythontime});
			res.setHeader('Content-Type', 'application/json');
			res.status(200).json({txNumber: msg.txNumber, python_time: msg.pythontime, blockchain_time: localtime - msg.pythontime});
		}
		else if(deployStatus == "Deployed"){
			var end = Date.now();
            var localtime = (end - start)/1000;
			console.log("ENCRYPTION TIME: ", msg.pythontime);
            console.log("BLOCKCHAIN TIME: ", localtime-msg.pythontime);
			console.log("TOTAL TIME TAKEN TO DEPLOY CONTRACT: ", localtime);
			console.log("************************************");
			mongo.update('contracts', 'txNumber', msg.txNumber, {address: msg.address, status: deployStatus, blockchain_time: localtime - msg.pythontime});
			//console.log("Contract deployed: ", msg);
		}
		else{
			console.log(deployStatus);
		}

	})
})

app.post('/getValueFromContract', function (req, res) {
	var start = Date.now();
	if(!req.body.contractName || !req.body.contractAddress || !req.body.fieldToGet){
	    	res.send(400, "Missing/Incorrect inputs. Please check them.");
	}
	else {
		contract.load(account, req.body.contractName, req.body.contractAddress, function(err, con){
			if(err) return res.status(500).json({error: err});
		
			contract.getValue(account, con, req.body.fieldToGet, function(err, val, enc_val, pythontime){	
				console.log(val);

    			mongo.getContract('address', req.body.contractAddress.toString(), function(err, c){
        			if(err) return res.status(500).json({error: err});
					var end = Date.now();
					var localtime = (end - start) / 1000;

					res.send(JSON.stringify({value: val, enc_value: enc_val, python_time: pythontime, blockchain_time: localtime - pythontime, mined_pythontime: c.python_time, mined_blockchaintime: c.blockchain_time}));
    				console.log("TIME TAKEN TO GET IN SERVER: ", (end - start)/1000);
        		});
   			 });
		});
	}
})

app.post('/addToValueInContract', function (req, res){ 
	var start = Date.now();

	if(!req.body.contractName || !req.body.contractAddress || !req.body.fieldToAdd || !req.body.addValue){
		res.send(400, "Missing/Incorrect inputs. Please check them.");
	}
	else {
		contract.load(account, req.body.contractName, req.body.contractAddress, function(err, con){
            if(err) return res.status(500).json({error: err});

            contract.addToField(account, con, req.body.fieldToAdd, req.body.addValue, function(err, txNumber, enc_val, pythontime){
 				var end = Date.now();
                var localtime = (end - start)/1000;
				res.send(JSON.stringify({txNumber: txNumber, enc_value: enc_val, python_time: pythontime, blockchain_time: localtime - pythontime}));
    			console.log("TIME TAKEN TO ADD IN SERVER: ", (end - start)/1000);
           });
        });
	}
})

app.get('/getNumContractsDeployed', function (req, res) {
	mongo.getNumContractsDeployed(function(err, num){
		if(err) return res.status(500).json({error: err});

		console.log("Number of contracts deployed: ",  num);
		res.status(200).json({numberOfContractsDeployed: num});
	});	
})

app.get('/getContract/txNumber/:txnumber', function (req, res) {
	mongo.getContract('txNumber', req.params.txnumber, function(err, c){
		if(err){
			if(err.includes("No contract found"))
				res.status(404).json({error: err});
			else
				res.status(500).json({error: err});
		}
		else {
			res.status(200).json({
				contractName: c.name,
				contractStatus: c.status, 
				contractAddress: c.address,
				contractTransactionNumber: c.txNumber,
				python_time: c.python_time,
				blockchain_time: c.blockchain_time
			});
		}
	});	
})

app.get('/getContract/address/:address', function (req, res) {
	mongo.getContract('address', req.params.address.toString(), function(err, c){
		if(err) return res.status(500).json({error: err});

		res.status(200).json({
			contractName: c.name,
			contractStatus: c.status, 
			contractAddress: c.address,
			contractTransactionNumber: c.txNumber,
			python_time: c.python_time,
            blockchain_time: c.blockchain_time
		});
	});	
})

app.get('/getAllContracts', function (req, res) {
	mongo.getContract('all', null, function(err, c){
		if(err) return res.status(500).json({error: err});
		console.log(c);
		res.status(200).json({contracts: c});
	});
})

app.get('/test', function (req, res) {
	enc.extraParamMontgo({"p": 97, "base": 10}, function(err, keys){
		res.status(200).json(keys);
	});
})


const PORT = 3002
app.listen(PORT, function() {
    console.log('Server listening on port ' + PORT + '!')
})
