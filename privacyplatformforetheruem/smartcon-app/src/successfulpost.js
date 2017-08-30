import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CheckCircle from 'material-ui/svg-icons/action/check-circle';
import {
  cyan500, cyan700, green500,
  pinkA200,
  grey100, grey300, grey400, grey500,
  white, darkBlack, fullBlack,
} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {fade} from 'material-ui/utils/colorManipulator';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import { connect } from 'react-redux';

import { pollContract } from './actions/actions';

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

const styles = {
	input: {
		borderTop: 'none rgb(224, 224, 224)', 
		borderRight: 'none rgb(224, 224, 224)', 
		borderBottom: '1px solid rgb(224, 224, 224)'
	} 
};

class SuccessfulPost extends Component {

	constructor(props) {
		super(props);
		console.log("the state is");
		console.log(this.state);
		console.log("the props are......");
		console.log(this.props);
		// this.props.dispatch(pollContract("0x8933c5b0bb41501bd71d57001de028f903808fac84feac492d40ae88b407ab39"));

	}

	componentWillReceiveProps(nextProps) {
		console.log("receiving props......");
		console.log(nextProps);

		this.props.dispatch(pollContract(nextProps.postContract.txNumber));
  	}

	render() {

		return (

			<MuiThemeProvider>

			<div className="summary">
				<Paper className="SummaryLabel" zDepth={0}>
						<h2>Success!</h2>
						<p>The contract has been posted! Your transaction is pending and you will receive a notification once your contract is deployed! </p>
						<CheckCircle color={green500} />

				</Paper>

				<Paper className="SummaryContract"style={styles.paper} zDepth={0}>
				<div>       

		          <div className="textBox">
			          <TextField className="contractInput" value={this.props.postContract && this.props.postContract.contract && this.props.postContract.contract.owner || ''} underlineDisabledStyle={styles.input} floatingLabelText="Contract Owner" fullWidth={true} floatingLabelFixed={true} disabled={true} />
				  </div>

		          <br/>
		          <div className="textBox">

			          <TextField className="contractInput" value={this.props.postContract && this.props.postContract.contract && this.props.postContract.contract.expenses || ''} underlineDisabledStyle={styles.input} floatingLabelText="Expenses" fullWidth={true} floatingLabelFixed={true} disabled={true} />
		          </div>

		          <br/>
			          <div className="textBox">
				          <TextField value = {this.props.postContract && this.props.postContract.contract && this.props.postContract.contract.startDate || ''} underlineDisabledStyle={styles.input} floatingLabelText="Start Date" fullWidth={true} floatingLabelFixed={true} disabled={true}/>
			          </div>
		          <br/>
			          <div className="textBox">
				          <TextField value = {this.props.postContract && this.props.postContract.contract && this.props.postContract.contract.endDate || ''} underlineDisabledStyle={styles.input} floatingLabelText="End Date" fullWidth={true} floatingLabelFixed={true} disabled={true}/>
			          </div>

		      	</div>
		      	</Paper>

			</div>

			</MuiThemeProvider>
		);
	}
}

function mapStateToProps(state) {
  console.log("this state is......");
  console.log(state);
  const { postContract } = state;
  const { isLoading, contract } = postContract;
  console.log("mapstatetoprops");
  console.log(postContract);
  return { postContract, isLoading };
}


export default connect(mapStateToProps)(SuccessfulPost);