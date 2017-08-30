import React, { Component } from 'react';

import './styles/Contract.css';
import injectTapEventPlugin from 'react-tap-event-plugin';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router';

import { connect } from 'react-redux';
import { postContract } from './actions/actions';
import Paper from 'material-ui/Paper';

import { getAllContracts } from './actions/actions';

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
  paper: {
    fontSize: 'xx-small'
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


class ViewContracts extends Component {

  constructor(props) {
    super(props);

    this.props.dispatch(getAllContracts());

  }
  

  render() {

    const { receiveAllContracts } = this.props;


    return (
    	<MuiThemeProvider muiTheme={muiTheme}>
      <div className="allContracts">
          {receiveAllContracts && receiveAllContracts.contracts && receiveAllContracts.contracts.map((contract) => (
            <Paper style={styles.paper} zDepth={0} className="contractView">
              <div>
              Contract Name:    {contract.name}
              </div>
              <div>
              Initial Value:   {contract.initialValue}
              </div>


                {(contract.status == 'Deployed'
                  ?
                  <div style={{color: '#4CAF50'}}>
                    Contract Status:  {contract.status}
                  </div>

                   : <div style={{color: '#EF5350'}}>
                      Contract Status:  {contract.status}
                    </div>
                )}

              <div>
              Contract Address:  {contract.address}
              </div>
              <RaisedButton className="addBalance" label="Get Value" primary={true} style={style} />
            </Paper>
          ))}
	    </div>


	    </MuiThemeProvider>

    );
  }
}

function mapStateToProps(state) {
  const { receiveAllContracts } = state;
  console.log("mapstatetoprops");
  console.log(receiveAllContracts);
  return { receiveAllContracts };
}

export default connect(mapStateToProps)(ViewContracts);
