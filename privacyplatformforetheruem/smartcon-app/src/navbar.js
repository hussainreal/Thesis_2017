import React, { Component } from 'react'
import Badge from 'material-ui/Badge'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import NotificationsIcon from 'material-ui/svg-icons/social/notifications'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import Menu from 'material-ui/Menu'
import Divider from 'material-ui/Divider'

import ActionDone from 'material-ui/svg-icons/action/done'
import NavigationClose from 'material-ui/svg-icons/navigation/close'

import { connect } from 'react-redux'

import { pollContract } from './actions/actions';

import Snackbar from 'material-ui/Snackbar';

import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router';



class Nav extends Component {

	constructor(props) {
		super(props);


		this.state = {
	    	contractAddress: '',
	    	contractDeployed: false,
	    	hasDeployed: false
	    };

	}

	componentWillReceiveProps(nextProps) {
		console.log("navbar receiving props......");
		console.log(nextProps);


		if (nextProps && nextProps.contractStatus && nextProps.contractStatus.response.contractStatus === "InProgress"){
			

	        setTimeout(() => {
	           this.props.dispatch(pollContract(nextProps.postContract.txNumber));
	        }, 6000);


	        // set to null after delpoyed is read
	        // perhaps dispatch something

		}

		if (nextProps && nextProps.contractStatus && nextProps.contractStatus.response.contractStatus === "Deployed" && !this.state.hasDeployed){
			
			this.setState({contractAddress: nextProps.contractStatus.response.contractAddress, contractDeployed: true, hasDeployed: true});

	        // set to null after delpoyed is read
	        // perhaps dispatch something

		}


  	}

  	handleRequestClose = () => {
	    this.setState({
	      contractDeployed: false,
	      contractAddress: ''
	    });
	  };

	handleActionRequest= () => {
		this.setState({
	      contractDeployed: false,
	      contractAddress: ''
	    });
		browserHistory.replace('/contract/'+this.state.contractAddress);
	  };



	render() {

		const { isLoading } = this.props


		return (
			<div className="Navigation">

		
				<nav className="w3-topnav w3-white" >
					<Link to="/contracts" className={(this.props.location.pathname.includes("/contracts")) ? "w3-hover-text-blue w3-hover-border-blue hover-active" : "w3-hover-text-blue w3-hover-border-blue"}>Create Contract</Link>
					<Link to="/viewcontracts" className={(this.props.location.pathname.includes("/viewcontracts")) ? "w3-hover-text-blue w3-hover-border-blue hover-active" : "w3-hover-text-blue w3-hover-border-blue"}>View Contracts</Link>
					{/*<Link to="/" className={(this.props.location.pathname === "/") ? "w3-hover-text-blue w3-hover-border-blue hover-active" : "w3-hover-text-blue w3-hover-border-blue"}>Create Contract</Link>*/}
					<Link to="/transactions" className={(this.props.location.pathname === "/transactions") ? "w3-hover-text-blue w3-hover-border-blue hover-active" : "w3-hover-text-blue w3-hover-border-blue"}>View Transactions</Link>
					
					<div className="menuOptions w3-right">
						<Link to="/contract/set/expenses" className={(this.props.location.pathname === "/contract/set/expenses") ? "w3-hover-text-blue w3-hover-border-blue hover-active" : "w3-hover-text-blue w3-hover-border-blue"}>Set Expenses</Link>
						<MuiThemeProvider>
							<Badge className="badge" badgeContent={4} secondary={true} badgeStyle={{height: 15, width: 15, top: 6, right: -6, backgroundColor: '#2196F3'}} style={{ position: 'absolute', padding: 0}}>
							<IconMenu menuItemStyle={{paddingRight:15, 'font-size': 15}} style={{paddingTop: 0, paddingBottom: 0}} listStyle={{paddingTop: 0, paddingBottom: 0}}
							iconButtonElement={ <IconButton style={{height: '100%', width: '100%', padding: 0}} disableTouchRipple={true}><NotificationsIcon/></IconButton>}
							anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
							targetOrigin={{horizontal: 'left', vertical: 'top'}}
							>
								<MenuItem primaryText="Contract Request 2" rightIcon={<div><ActionDone color={'#00E676'} /> <NavigationClose color={'#F44336'} /> </div>}/>
								<Divider />
								<MenuItem primaryText="Contract Request 4" rightIcon={<div><ActionDone color={'#00E676'} /> <NavigationClose color={'#F44336'} /> </div> }/>

							</IconMenu>
							</Badge>


						</MuiThemeProvider>
					</div>

				</nav>

					<MuiThemeProvider>
						<Snackbar open={this.state.contractDeployed} bodyStyle={{maxWidth: 3500}} contentStyle={{maxWidth: 2000, minWidth: 700}} style={{maxWidth: 2000}}
							message={"Contract with address " + this.state.contractAddress + " deployed!"}
							autoHideDuration={5000}
							action='Get Balance'
							onActionTouchTap={this.handleActionRequest}
							onRequestClose={this.handleRequestClose}/>
					</MuiThemeProvider>

				<div id="backgroundimg" />

				<div className="container">
				   {this.props.children}
                </div>
			</div>
		);
	}
}

function mapStateToProps(state) {
  console.log("navbar this state is......");
  console.log(state);
  const { postContract, contractStatus } = state;
  const { isLoading, contract } = postContract;
  console.log("navbar mapstatetoprops");
  console.log(contractStatus);
  return { postContract, isLoading, contractStatus };
}

export default connect(mapStateToProps)(Nav);