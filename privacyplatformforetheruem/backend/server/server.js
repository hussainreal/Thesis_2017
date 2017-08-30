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
var account = "0xe5f0367760b9cdeec8222ecf102f198ae390c3b8";

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

	if(!req.body.contractName || !req.body.fieldToBeEncrypted || !req.body.initialValue){
		res.status(400).json({error: "Missing/Incorrect inputs. Please check them."});
	}
	
	contract.deploy(account, req.body.contractName, req.body.fieldToBeEncrypted, req.body.initialValue, function(deployStatus, msg){
		
		if(deployStatus == "Failed"){
			res.setHeader('Content-Type', 'application/json');
			res.status(500).json({response: "Failed to deploy: " + msg});
		}
		else if(deployStatus == "InProgress"){
			mongo.insert('contracts', {name: req.body.contractName, status: deployStatus, txNumber: msg, address: '0'});
			res.setHeader('Content-Type', 'application/json');
			console.log("PRINTING TXNUMBER RIGHT BEFORE SENDING RESPONSE: ", msg)
			res.status(200).json({txnumber: msg});
		}
		else if(deployStatus == "Deployed"){
			mongo.update('contracts', 'txNumber', msg.txNumber, {address: msg.address, status: deployStatus});
			console.log("Contract deployed: ", msg);
		}
	})
})

app.post('/getValueFromContract', function (req, res) {
	if(!req.body.contractName || !req.body.contractAddress || !req.body.fieldToGet){
	    	res.send(400, "Missing/Incorrect inputs. Please check them.");
	}
	else {
		contract.load(account, req.body.contractName, req.body.contractAddress, function(err, con){
			if(err) return res.status(500).json({error: err});
		
			contract.getValue(account, con, req.body.fieldToGet, function(err, val){	
				console.log(val);
				res.send(JSON.stringify({value: val}));
			});
		});
	}
})

app.post('/addToValueInContract', function (req, res){ 
	if(!req.body.contractName || !req.body.contractAddress || !req.body.fieldToAdd || !req.body.addValue){
		res.send(400, "Missing/Incorrect inputs. Please check them.");
	}
	else {
		contract.load(account, req.body.contractName, req.body.contractAddress, function(err, con){
            if(err) return res.status(500).json({error: err});

            contract.addToField(account, con, req.body.fieldToAdd, req.body.addValue, function(err, txNumber){
                res.send(JSON.stringify({txNumber: txNumber}));
            });
        });
	}
})

app.post('/mul', function (req, res){ 
	if(!req.body.contractName || !req.body.contractAddress || !req.body.a || !req.body.b){
		res.send(400, "Missing/Incorrect inputs. Please check them.");
	}
	else {
		contract.load(account, req.body.contractName, req.body.contractAddress, function(err, con){
            if(err) return res.status(500).json({error: err});
			
			console.log("A: " + req.body.a + "    B: " + req.body.b);
            contract.mul(account, con, req.body.a, req.body.b, function(err, txNumber){
                res.send(JSON.stringify({txNumber: txNumber}));
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
				contractTransactionNumber: c.txNumber
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
			contractTransactionNumber: c.txNumber
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
/*	enc.generateKeys(function(err, keys){
		res.status(200).json(keys);
	});

	enc.encryptNum({"public_key": {"g": 2869930398, "n": 2869930397,  "n_sq": 8236500483624577609}, "number": 5 }, function(err, keys){
        res.status(200).json(keys);
    });

	enc.decryptNum({"public_key": {"g": 2869930398, "n": 2869930397,  "n_sq": 8236500483624577609}, "private_key": {"l": 2869822716,  "m": 1006971613}, "number": 3687577461138791997 }, function(err, keys){
        res.status(200).json(keys);
    });
	enc.toMontgo({"x": 56, "p": 97}, function(err, keys){
		res.status(200).json(keys);
	});

	enc.fromMontgo({"montgo_num": 46, "p": 97}, function(err, keys){
		res.status(200).json(keys);
	});

*/	
	enc.extraParamMontgo({"p": 97, "base": 10}, function(err, keys){
		res.status(200).json(keys);
	});
})


const PORT = 3001
app.listen(PORT, function() {
    console.log('Server listening on port ' + PORT + '!')
})
