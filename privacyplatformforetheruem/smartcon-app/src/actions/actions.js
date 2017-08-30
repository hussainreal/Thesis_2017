import fetch from 'isomorphic-fetch';

export const REQUEST_TRANSACTION = 'REQUEST_TRANSACTION';
export const FETCH_TRANSACTIONS = 'FETCH_TRANSACTIONS';
export const RECEIVE_TRANSACTIONS = 'RECEIVE_TRANSACTIONS';

export const RECEIVE_ALLCONTRACTS = 'RECEIVE_ALLCONTRACTS';

export const RECEIVE_CONTRACT = 'RECEIVE_CONTRACT';

export const ADDED_VALUE = 'ADDED_VALUE';


export const POST_CONTRACT = 'POST_CONTRACT';

export const CONTRACT_STATUS = 'CONTRACT_STATUS';

function requestTransaction(transaction) {
  return {
    type: 'REQUEST_TRANSACTION',
    transaction
  }
}

function receiveTransactions(transaction, json) {
  return {
    type: RECEIVE_TRANSACTIONS,
    transaction,
    transactions: json,
  }
}

export function fetchTransactions(transaction) {
  return (dispatch) => {
  		dispatch(requestTransaction(transaction));
  		return fetch('http://demo5112947.mockable.io/transactions')
		.then(response => response.json())
		.then(json => dispatch(receiveTransactions(transaction, json)))
  }
}

function receiveContracts(json) {
  return {
    type: RECEIVE_ALLCONTRACTS,
    contracts: json.contracts,
  }
}


export function getAllContracts() {
  return (dispatch) => {
      return fetch('http://ethnode2.canadaeast.cloudapp.azure.com:3002/getAllContracts')
    .then(response => response.json())
    .then(json => dispatch(receiveContracts(json)))
  }
}

function receiveContractValue(data, json) {
  return {
    type: RECEIVE_CONTRACT,
    value: data,
    contract: json,
  }
}


var myHeaders = new Headers();

myHeaders.append('Content-Type', 'application/json');

export function getContractValue(contract) {
  return (dispatch) => {
      console.log("posting....");
      console.log(JSON.stringify(contract));
      return fetch('http://ethnode2.canadaeast.cloudapp.azure.com:3002/getValueFromContract', {
        method: 'POST',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default',
        body: JSON.stringify(contract), 

    }).then(status)
      .then(json)
      .then(function(data) { dispatch(receiveContractValue(contract, data))})
      .catch(function(err) {console.log(err)/*also dispatch a seperate action for failure later */});
  }
}


function addedValueToContract(data) {
  return {
    type: ADDED_VALUE,
    value: data,
  }
}

export function addToValueInContract(contract) {
  return (dispatch) => {
      console.log("posting....");
      console.log(JSON.stringify(contract));
      return fetch('http://ethnode2.canadaeast.cloudapp.azure.com:3002/addToValueInContract', {
        method: 'POST',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default',
        body: JSON.stringify(contract), 

    }).then(status)
      .then(json)
      .then(function(data) { dispatch(addedValueToContract(data))})
      .catch(function(err) {console.log(err)/*also dispatch a seperate action for failure later */});
  }
}


function status(response) {  
  if (response.status >= 200 && response.status < 300) {  
    return Promise.resolve(response)  
  } else {  
    return Promise.reject(new Error(response.statusText))  
  }  
}

function json(response) {  
  return response.json()  
}

function postedContract(contract, response) {
  return {
    type: POST_CONTRACT,
    contract,
    response: response
  }
}

export function postContract(contract) {
  return (dispatch) => {
      console.log("posting....");
      console.log(JSON.stringify({contract}));
      return fetch('http://ethnode2.canadaeast.cloudapp.azure.com:3002/deployContract', {
        method: 'POST',
        body: JSON.stringify({contract}), 
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
    }).then(function(response) { dispatch(postedContract(contract, response)) });
  }
}

function checkContractStatus(response) {
  return {
    type: CONTRACT_STATUS,
    response: response
  }
}

export function pollContract(txNumber) {
  return (dispatch) => {
      return fetch('http://ethnode2.canadaeast.cloudapp.azure.com:3002/getContract/txNumber/'+txNumber)
    .then(response => response.json())
    .then(json => dispatch(checkContractStatus(json)))
  }
}

export function deployContract(contract) {
  return (dispatch) => {
      console.log("posting....");
      console.log(JSON.stringify(contract));
      return fetch('http://ethnode2.canadaeast.cloudapp.azure.com:3002/deployContract', {
        method: 'POST',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default',
        body: JSON.stringify(contract), 

    }).then(status)
      .then(json)
      .then(function(data) { dispatch(postedContract(contract, data))})
      .catch(function(err) {console.log(err)/*also dispatch a seperate action for failure later */});
  }
}