import React, { Component } from 'react';

import './styles/Contract.css';
import injectTapEventPlugin from 'react-tap-event-plugin';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router';
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';


import { connect } from 'react-redux';
import { addToValueInContract } from './actions/actions';

import {
  cyan500, cyan700,
  pinkA200,
  grey100, grey300, grey400, grey500,
  white, darkBlack, fullBlack,
} from 'material-ui/styles/colors';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {fade} from 'material-ui/utils/colorManipulator';
import spacing from 'material-ui/styles/';

const style = {
  margin: 12,
};

const styles = {
  block: {
    maxWidth: 12,
  },
  checkbox: {
    marginBottom: -40,
  },

  input: {
    borderTop: 'none rgb(224, 224, 224)', 
    borderRight: 'none rgb(224, 224, 224)', 
    borderBottom: '1px solid rgb(224, 224, 224)'
  } 
};



const muiTheme = getMuiTheme({

  palette: {
    primary1Color: '#2196F3',
    primary2Color: '#2196F3',
    primary3Color: grey400,
    accent1Color: pinkA200,
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: '#333',
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    disabledColor: '#2196F3',
    pickerHeaderColor: cyan500,
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fullBlack

  }
});

const muiTheme2 = getMuiTheme({

  palette: {
    primary1Color: '#2196F3',
    primary2Color: cyan700,
    primary3Color: grey400,
    accent1Color: pinkA200,
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: fullBlack,
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    disabledColor: '#2196F3',
    pickerHeaderColor: cyan500,
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fullBlack

  }
});


class SetContract extends Component {

  constructor(props) {
    super(props);
    this.state = {
    	errorTextContractAddress: '', errorTextSenderAddress: '', errorTextExpenses: '', errorTextExpensesName: '', errorTextExpensesDescr: '',
      open: false,
    };
  }
  
  handleSubmit(event) {
  	event.preventDefault();
  	console.log(this);

  	// The refs things is a little more convoluted than a standard input just because of the way
  	// material-ui implements the text field
  	let _contractAddress = this.refs.contractAddress.input.value;
  	let _senderAddress = this.refs.senderAddress.input.value;
  	let _expenses = this.refs.expenses.input.value;
  	let _expensesName = this.refs.expensesName.input.value;
    let _expensesDescr = this.refs.expensesDescr.input.refs.input.value;


  	(_contractAddress === '') ? this.setState({errorTextContractAddress: "This field is required"}) : this.setState({errorTextContractAddress: ""});
  	(_senderAddress === '') ? this.setState({errorTextSenderAddress: "This field is required"}) : this.setState({errorTextSenderAddress: ""});
  	(_expenses === '') ? this.setState({errorTextExpenses: "This field is required"}) : this.setState({errorTextExpenses: ""});
  	(_expensesName === '') ? this.setState({errorTextExpensesName: "This field is required"}) : this.setState({errorTextExpensesName: ""});
    (_expensesDescr === '') ? this.setState({errorTextExpensesDescr: "This field is required"}) : this.setState({errorTextExpensesDescr: ""});


  	if (_contractAddress === ''  || _senderAddress === '' || _expenses === '' || _expensesName === '' || _expensesDescr === '') return;

    console.log("here.....");

  	// this.setState({
  	// 	owner: _owner,
  	// 	expenses: _expenses,
  	// 	startDate: _startDate,
  	// 	endDate: _endDate,
   //    open: true
  	// });

    this.setState({open: true});
    this.props.dispatch(addToValueInContract({contractName: 'Conference', contractAddress: _contractAddress, fieldToAdd: 'balance', addValue: _expenses}));

  	console.log(this);

  }

  handleClose = () => {
    this.setState({open: false});
  };

  render() {

    const actions = [
      <FlatButton
        label="Ok"
        primary={true}
        onTouchTap={this.handleClose}/>,
    ];

    return (
    	<MuiThemeProvider muiTheme={muiTheme}>
      <div className="contractBox">
	      <div className="Contract">       

	      	<form onSubmit={this.handleSubmit.bind(this)}>
	          <div className="textBox">
		          <TextField className="contractInput" ref="contractAddress" floatingLabelText="Contract Address" fullWidth={true} floatingLabelFixed={true} errorText={this.state.errorTextContractAddress}/>
			      </div>

	          <br/>

            <div className="textBox">
              <TextField className="contractInput" ref="senderAddress" floatingLabelText="Sender Address" fullWidth={true} floatingLabelFixed={true} errorText={this.state.errorTextSenderAddress}/>
            </div>

            <br/>

            <div className="textBox">

              <TextField className="contractInput" value={'117724361726052232286642729503619885226396848298440290194474368106181877843301454349676344086382538003780399137832758867778222252201458886767547437337543045586657569159374425258039121862112545733028126116907766250403035801176460752912327774508255666696312630982168986041970059274372378012061526901950296772972'} underlineDisabledStyle={styles.input} floatingLabelText="Public Key" fullWidth={true} floatingLabelFixed={true} disabled={true} />
            </div>

            <br/>


	          <div className="textBox">
		          <TextField className="contractInput" ref="expenses" floatingLabelText="Expenses To Add" fullWidth={true} floatingLabelFixed={true} errorText={this.state.errorTextExpenses}/>
	          </div>

            <br/>

	          {/*<MuiThemeProvider muiTheme={muiTheme2}>
		          <div className="textBox">
			          <DatePicker hintText="Date" ref="startDate" floatingLabelText="Start Date" fullWidth={true} floatingLabelFixed={true} errorText={this.state.errorTextStartDate}/>
		          </div>
	          </MuiThemeProvider>*/}
	          <br/>
	          <RaisedButton type="submit" label="Add Expenses" primary={true} style={style} />
             <Dialog
              title={"Adding encrypted " + ((this.refs.expenses && this.refs.expenses.input) ? this.refs.expenses.input.value : " ") + " to Contract " + ((this.refs.expenses && this.refs.expenses.input) ? this.refs.contractAddress.input.value : " ")}
              modal={false}
              open={this.state.open}
              actions={actions}
              contentStyle={{width: '50%'}}>
              {/*<CircularProgress className="progress" size={60} thickness={7} /> */}

              <span> Your value is being encrypted as we speak!</span>
              <br/>
              <span> You will be notified once your value has successfully been added to the contract! </span>
            </Dialog>
	    	</form>

	      </div>

      <div className="gasBox">
        <h1 style={{fontSize: 16, color: '#2196F3'}}>Cost of Transaction</h1>
        <div className="textBoxGas" style={{color: '#00C853'}}>
          $3.31
        </div>
      </div>

      <div className="descriptionNameBox">

            <div className="textBox">
              <TextField className="contractInput" ref="expensesName" floatingLabelText="Name of Expense" fullWidth={true} floatingLabelFixed={true} errorText={this.state.errorTextExpensesName}/>
            </div>

            <br/>
      </div>


      <div className="descriptionBox">

            <div className="textBox">
              <TextField className="contractInput" ref="expensesDescr" floatingLabelText="Description of Expense" fullWidth={true} floatingLabelFixed={true} multiLine={true} rows={2}rowsMax={3} errorText={this.state.errorTextExpensesDescr}/>
            </div>

            <br/>
      </div>

	    </div>


	    </MuiThemeProvider>

    );
  }
}

function mapStateToProps(state) {
  const { postContract } = state;
  const { isLoading } = postContract;
  console.log("mapstatetoprops");
  console.log(postContract);
  return { postContract, isLoading };
}

export default connect(mapStateToProps)(SetContract);
