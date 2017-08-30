import React, { Component } from 'react';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
// Must import for material-ui components to work
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
//
import { connect } from 'react-redux';
import { fetchTransactions } from './actions/actions';
import rootReducer from './reducers/reducers';



const styles = {
	invisibleSeperator: {
		 visibility: 'hidden',
	},
	tableRow: {
		textAlign: 'center',
	},
  	paper: {
	    width: '90%',
	    margin: 20,
	    paddingBottom: 20,
	    textAlign: 'center',
	    display: 'table',
	    margin: 'auto',
	},
    button: {
        margin: 12,
    },
    buttonContainer: {
    	marginLeft: '5%'
    },
    buttonColor: {
    	backgroundColor: '#2196F3'
    }
};

class Transactions extends Component {

	constructor(props) {
		super(props);
		this.state = {
			page: 'transactions',
			stripedRows: false,
			showRowHover: true,
			showCheckboxes: true,
			selectable: true,
		    multiSelectable: true,
		    enableSelectAll: true,
		    deselectOnClickaway: true,
		    showCheckboxes: true,
		};
	console.log("this props ");
	console.log(this.props);
	if (!this.props.fetchTransactions) {
		this.props.dispatch(fetchTransactions("placeholder"));
	}

	}
	// Need this for material-ui to work
	getChildContext() {
        return { muiTheme: getMuiTheme(baseTheme) };
	}

	componentDidMount() {
		console.log("mounting ......");
		console.log(this.props);
  	}

  	//just have this onclick for testing feel free to change it if you need to
  	handleNewTransaction() {
  		console.log("new dispatch");
  		this.props.dispatch(fetchTransactions("transaction1"));
  	}


	render() {
		const { rootReducer } = this.props;

		return (

		<div>
			<div style={styles.buttonContainer}>
				<RaisedButton label="Download" primary={true} buttonStyle={styles.buttonColor} onClick={this.handleNewTransaction.bind(this)}/>
		        <RaisedButton label="More Info" primary={true} buttonStyle={styles.buttonColor} style={styles.button} />
		    </div>
			<Paper style={styles.paper} zDepth={5}>
		        <Table
		        	selectable={this.state.selectable}
	          		multiSelectable={this.state.multiSelectable}

		        >
					<TableHeader
						displaySelectAll={this.state.showCheckboxes}
						adjustForCheckbox={this.state.showCheckboxes}
						enableSelectAll={this.state.enableSelectAll}
					>
						<TableRow colSpan="3" style={styles.tableRow}>
						    <TableHeaderColumn tooltip="Date of Transaction">Date</TableHeaderColumn>
						    <TableHeaderColumn tooltip="Associated Contract">Contract</TableHeaderColumn>
						    <TableHeaderColumn tooltip="Transaction Amount">Amount</TableHeaderColumn>
						    <TableHeaderColumn tooltip="Transaction Status">Status</TableHeaderColumn>
						</TableRow>
					</TableHeader>
					<TableBody
						displayRowCheckbox={this.state.showCheckboxes}
						deselectOnClickaway={this.state.deselectOnClickaway}
						showRowHover={this.state.showRowHover}
						stripedRows={this.state.stripedRows}
					>
						{this.props.fetchTransactions && this.props.fetchTransactions.transactions.map((transactions) => (
						    <TableRow>
						        <TableRowColumn>{transactions.date}</TableRowColumn>
						        <TableRowColumn>
						        	<a href={transactions.contract.url}>{transactions.contract.name}</a>
						        </TableRowColumn>
						        <TableRowColumn>{transactions.amount}</TableRowColumn>
						        <TableRowColumn>{transactions.status}</TableRowColumn>
						    </TableRow>
						))}
					</TableBody>
		        </Table>
			</Paper>
        </div>

		);
	}
}
// Need this for material-ui to work
Transactions.childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
};


function mapStateToProps(state) {
  console.log(state);
  const { fetchTransactions } = state;
  return { fetchTransactions };
}

export default connect(mapStateToProps)(Transactions);