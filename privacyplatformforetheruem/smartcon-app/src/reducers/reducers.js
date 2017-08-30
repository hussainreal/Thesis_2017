import { combineReducers } from 'redux';
import { FETCH_TRANSACTIONS, RECEIVE_TRANSACTIONS, POST_CONTRACT, RECEIVE_ALLCONTRACTS, RECEIVE_CONTRACT, ADDED_VALUE, CONTRACT_STATUS} from '../actions/actions';
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router';

function fetchTransactions(state={}, action) {
	switch (action.type) {
		case RECEIVE_TRANSACTIONS:
			return Object.assign({}, state, {transactions: action.transactions});

		default:
			return state;
	}
}

function receiveAllContracts(state={}, action) {
	switch (action.type) {
		case RECEIVE_ALLCONTRACTS:
			console.log("all contracts.....");
			console.log(action.contracts);
			return Object.assign({}, state, {contracts: action.contracts});

		default:
			return state;
	}
}


function receiveContractValue(state={}, action) {
	switch (action.type) {
		case RECEIVE_CONTRACT:
			console.log("all contracts.....");
			console.log(action);
			return Object.assign({}, state, {contracts: action});

		default:
			return state;
	}
}

function postContract(state={}, action) {
	switch (action.type) {
		case POST_CONTRACT:
			console.log("posting contract........");
			// browserHistory.replace('/contracts/movie/success');
			console.log(action);

			browserHistory.replace('/contracts/expenses/success');


			return Object.assign({}, state, {txNumber: action.response.txNumber, isLoading: false, contract: action.contract});

		default:
			return state;
	}
}


function contractStatus(state={}, action) {
	switch (action.type) {

		case CONTRACT_STATUS:

			console.log("logging contract status of deployed contract");
			console.log(action.response);

			// get time here

			return Object.assign({}, state, {response: action.response});

		default:
			return state;
	}
}


const rootReducer = combineReducers({
  fetchTransactions,
  receiveAllContracts,
  receiveContractValue,
  postContract,
  contractStatus
  //OTHER REDUCERS CAN BE ADDED HERE EVENTUALLY
})


export default rootReducer;