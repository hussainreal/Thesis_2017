import React, { Component } from 'react';
import logo from './assets/logo.svg';
import './styles/App.css';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';

import {GridList, GridTile} from 'material-ui/GridList';
import Subheader from 'material-ui/Subheader';

import ticketImg from './assets/ticket.svg';
import img2 from './assets/certificate.svg';
import img3 from './assets/warehouse.svg';
import img4 from './assets/img4.jpg';

import Snackbar from 'material-ui/Snackbar';

import { browserHistory } from 'react-router'
import Transactions from './transactions'

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 500,
    height: 500,
    overflowY: 'auto',
  },

  paper: {
    width: '90%',
    height: '100%',
    margin: 20,
    textAlign: 'center',
    display: 'table',
    margin: 'auto',
  },
};

const tilesData = [
  {
    title: 'Movie',
    img: ticketImg,
    description: 'A contract template for purchasing Movie Tickets',
  },
  {
    title: 'Services',
    img: img2,
    description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum',
  },
  {
    title: 'Expenses',
    img: img3,
    description: 'A contract template for employees to expense their work',
  },
  {
    title: 'Coming soon!',
    img: img3,
    description: 'Coming Later',
  },
];


class Contracts extends Component {

  constructor(props) {
    super(props);
    this.state = {activeDescr: ''}
  }

  handleActiveHover = (description) => this.setState({activeDescr: description});
  handleDisableHover = () => this.setState({activeDescr: ''});

  handleNewContract(contractType) {
    if (contractType === 'Expenses') {
      browserHistory.push('/contracts/expenses');
    }
    else {
      browserHistory.push('/contracts/movie');
    }
  }
	render() {
		return (
			<MuiThemeProvider>

				<div style={styles.root}>

				<GridList
				cellHeight={180}
				style={styles.gridList}
				>
        <Subheader style = {{fontFamily: 'Roboto, sans-serif', fontSize: 36, color: '#333', marginTop: 24, marginLeft: 100}}></Subheader>
				{tilesData.map((tile) => (
				<Paper style={styles.paper} zDepth={1} className="descr">
        <GridTile
				key={tile.title}
				title={tile.title}
        titleBackground={'#333'}
        onMouseEnter={this.handleActiveHover.bind(this, tile.title)}
        onMouseLeave={this.handleDisableHover.bind(this)}
				>
        <div className="tileDescr" onClick={this.handleNewContract.bind(this,tile.title)}>{(this.state.activeDescr === tile.title) ? tile.description: ''}
        <img src={(this.state.activeDescr !== tile.title) ? tile.img: ''} className={(this.state.activeDescr !== tile.title) ? 'templateIcon': ''}/></div>
				</GridTile>
        </Paper>
				))}
				</GridList>


        </div>

      </MuiThemeProvider>



		);
	}	
}

export default Contracts;