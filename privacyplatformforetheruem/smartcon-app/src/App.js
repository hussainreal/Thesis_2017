import React, { Component } from 'react';
import logo from './assets/logo.svg';
import './styles/App.css';
import Nav from './navbar';
import Transactions from './transactions';
import Contracts from './contracts';
import MovieContract from './moviecontract';
import ExpensesContract from './expensescontract';
import SuccessfulPost from './successfulpost';
import GetContract from './getcontract';
import SetContract from './setcontract';


import ViewContracts from './viewcontracts';
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers/reducers';
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'

injectTapEventPlugin();

const loggerMiddleware = createLogger()
let store = createStore(rootReducer, {fetchTransactions: null, contractStatus: null}, applyMiddleware(
      thunkMiddleware,loggerMiddleware
    ));

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={browserHistory}>
          <Route component={Nav}>
            <Route path="/" component={Contracts} />
            <Route path="/contracts" component={Contracts} />
            <Route path="/contracts/movie" component={MovieContract} />
            <Route path="/contracts/movie/success" component={SuccessfulPost} />
            <Route path="/contracts/expenses" component={ExpensesContract} />
            <Route path="/contracts/expenses/success" component={SuccessfulPost} />
            <Route path="/viewcontracts" component={ViewContracts} />
            <Route path="/contract/:address" component={GetContract} />
            <Route path="/contract/set/expenses" component={SetContract} />

            <Route path="/transactions" component={Transactions} />
          </Route>
        </Router>
      </Provider>
      );
  }
}
export default App;