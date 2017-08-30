import React, { Component } from 'react';

import './styles/Contract.css';
import injectTapEventPlugin from 'react-tap-event-plugin';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
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
import { deployContract } from './actions/actions';

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


class ExpensesContract extends Component {

  constructor(props) {
    super(props);
    this.state = {
    	owner: '', expenses: '', startDate: '', endDate: '',
    	errorTextFrom: '', errorTextTo: '', errorTextAmount: '', errorTextStartDate: '', errorTextEndDate: '', checked: true
    };
  }
  
  handleSubmit(event) {
  	event.preventDefault();
  	console.log(this);

  	// The refs things is a little more convoluted than a standard input just because of the way
  	// material-ui implements the text field
  	let _owner = this.refs.owner.input.value;
  	let _expenses = this.refs.expenses.input.value;
  	let _startDate = this.refs.startDate.refs.input.input.value;
  	let _endDate = this.refs.endDate.refs.input.input.value;

  	(_owner === '') ? this.setState({errorTextFrom: "This field is required"}) : this.setState({errorTextFrom: ""});
  	(_expenses === '') ? this.setState({errorTextAmount: "This field is required"}) : this.setState({errorTextAmount: ""});
  	(_startDate === '') ? this.setState({errorTextStartDate: "This field is required"}) : this.setState({errorTextStartDate: ""});
  	(_endDate === '') ? this.setState({errorTextEndDate: "This field is required"}) : this.setState({errorTextEndDate: ""});

  	if (_owner === ''  || _expenses === '' || _startDate === '' || _endDate === '') return;

    console.log("here.....");

  	this.setState({
  		owner: _owner,
  		expenses: _expenses,
  		startDate: _startDate,
  		endDate: _endDate,
      open: true
  	});

    this.props.dispatch(deployContract({contractName: 'Conference', fieldToBeEncrypted: 'balance', 'initialValue': _expenses, owner: _owner, expenses: _expenses, startDate: _startDate, endDate: _endDate, checked: this.state.checked}));

  	console.log(this);

  }

  render() {
    const { isLoading } = this.props

    return (
    	<MuiThemeProvider muiTheme={muiTheme}>
      <div className="contractBox">
	      <div className="Contract">       

	      	<form onSubmit={this.handleSubmit.bind(this)}>
	          <div className="textBox">
		          <TextField className="contractInput" ref="owner" floatingLabelText="Contract Owner" fullWidth={true} floatingLabelFixed={true} errorText={this.state.errorTextFrom}/>
			      </div>

	          <br/>
            
	          <div className="textBox">
               <Checkbox className="lock"
                  checkedIcon={<i className="fa fa-lock fa-2x" aria-hidden="true" onClick=""></i>}
                  uncheckedIcon={<i className="fa fa-unlock fa-2x" aria-hidden="true" onClick=""></i>}
                  style={styles.checkbox}/>
		          <TextField className="contractInput" ref="expenses" floatingLabelText="Expenses" fullWidth={true} floatingLabelFixed={true} errorText={this.state.errorTextAmount}/>
	          </div>

	          <br/>
	          <MuiThemeProvider muiTheme={muiTheme2}>
		          <div className="textBox">
			          <DatePicker hintText="Start Date" ref="startDate" floatingLabelText="Start Date" fullWidth={true} floatingLabelFixed={true} errorText={this.state.errorTextStartDate}/>
		          </div>
	          </MuiThemeProvider>
	          <br/>
	          <MuiThemeProvider muiTheme={muiTheme2}>
		          <div className="textBox">
			          <DatePicker hintText="End Date" ref="endDate" floatingLabelText="End Date" fullWidth={true} floatingLabelFixed={true} errorText={this.state.errorTextEndDate}/>
		          </div>
	          </MuiThemeProvider>
	          <RaisedButton type="submit" label="Create Contract" primary={true} style={style} />
            <Dialog
              title="Creating Contract"
              modal={false}
              open={!isLoading && this.state.open || false}
              contentStyle={{width: '50%'}}>
              <CircularProgress className="progress" size={60} thickness={7} />
            </Dialog>
	    	</form>

	      </div>

      <div className="gasBox">
        <h1 style={{fontSize: 16, color: '#2196F3'}}>Cost of Transaction</h1>
        <div className="textBoxGas" style={{color: '#00C853'}}>
          $4.00
        </div>
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

export default connect(mapStateToProps)(ExpensesContract);
