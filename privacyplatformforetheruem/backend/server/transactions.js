var fs = require('fs-extra');
var cmd = require('node-cmd');
var Web3 = require('web3');
/* TODO: 
     Change the log file path to /tuffleapp/backend/transactions/geth.log
     Add a watcher service on nodejs for the log file and parse only the updated transactions values
*/ 
getTransactions = function(callback) {
  var tx_data = '../transactions/tx_data.json';
  //Read transaction log line by line
  fs.readFile(tx_data, function read(err, data) {
    if (err) {
        throw err;
    }
    var buffer = data;
    var results = buffer.toString();
    
    return callback(results);
    
  });
}

var parseLineData = function(line, time){
  var parser = line.split(' ');

  var tx_id = parser[3].substring(3, parser[3].length -1);
  var event = parser[4].substring(0, parser[4].length -1);
  var contract_address = parser[5];
  
  /*Retrieved transaction Information from the geth console:
  
    hash: DATA, 32 Bytes - hash of the transaction.
    nonce: QUANTITY - the number of transactions made by the sender prior to this one.
    blockHash: DATA, 32 Bytes - hash of the block where this transaction was in. null when its pending.
    blockNumber: QUANTITY - block number where this transaction was in. null when its pending.
    transactionIndex: QUANTITY - integer of the transactions index position in the block. null when its pending.
    from: DATA, 20 Bytes - address of the sender.
    to: DATA, 20 Bytes - address of the receiver. null when its a contract creation transaction.
    value: QUANTITY - value transferred in Wei.
    gasPrice: QUANTITY - gas price provided by the sender in Wei.
    gas: QUANTITY - gas provided by the sender.
    input: DATA - the data send along with the transaction.*/
    
  var tx = web3.eth.getTransaction(tx_id);
  
  //Organize the data to be send to the front-end
  if (tx !== null){
    var block = web3.eth.getBlock(tx.blockNumber);
    if(time == null || typeof time == "undefined")
      time = new Date(block.timestamp*1000);
    var tx_info = {
      //Converting time from seconds to milliseconds
      'time': time,
      'transactionHash': tx.hash,
      'from': tx.from,
      'to': tx.to,
      'blockNumber': tx.blockNumber,
      'transactionIndex': tx.transactionIndex, //Index in block
      'contract': contract_address,
      'event': event,
      'gasPriced': tx.gasPrice.toString(),
      'gasPayed': tx.gas,
      'valueTransfered': tx.value.toString() //In wei
    };
    console.log(tx_info.time, tx_id, event, contract_address);
    return tx_info;
  }
  
  return {};
}

updateTransactions = function(callback) {
  //Initialize web3
  if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
  } else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8555"));
  }
  
  //Unlock account -- future purposes
  //var account = "0xe5f0367760b9cdeec8222ecf102f198ae390c3b8"
  //web3.personal.unlockAccount(account, "des1gn_project", 3600);
  
  //Initialize data to be empty
  var result = [];
	//Initialize the location of the transaction log and data files
	var geth_log = '../transactions/geth.log';
  var tx_data = '../transactions/tx_data.json';
 
  //Read transaction log line by line
  fs.readFile(geth_log, function read(err, data) {
    if (err) throw err;
    var buffer = data;
    var tx_array = buffer.toString().split('\n').filter(function(line){
      return line.indexOf('Tx(0x') != -1;
    });
 
    //Go through each logged transaction and parse out important information
    tx_array.forEach(function(line){
      if (typeof line !== 'undefined' && line != ''){
        var tx_info = parseLineData(line);         
        result.push(tx_info);
      }
    });
    
    //Write updates to file
    fs.writeFile(tx_data, JSON.stringify(result, null, 2), (err) => {
      if (err) throw err;
      console.log('Updated transaction data!');
      result = [];
    });
    
  });
  
  //Update transactions preiodically by watching the log file
  fs.watchFile(geth_log, (curr, prev) => {
    console.log("File changed!");
    fs.readFile(geth_log, function(err, data) {
      if (err) throw err;
  
      var lines = data.toString().split('\n');
      var lastLine = lines.slice(-2)[0];
      console.log(lastLine);
      if(lastLine.indexOf('Tx(0x') != -1 && typeof lastLine !== 'undefined' && lastLine != ''){
        var tx_info = parseLineData(lastLine, new Date());
        result = require(tx_data);
        result.push(tx_info);
        //Write updates to file
        fs.writeFile(tx_data, JSON.stringify(result, null, 2), (err) => {
          if (err) throw err;
          console.log('Updated transaction data!');
          result = [];
        });           
      }
    });
  });

}

module.exports = {
	getTransactions: getTransactions,
  updateTransactions: updateTransactions
}
