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
import { getContractValue } from './actions/actions';

import Snackbar from 'material-ui/Snackbar';


import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router';
import {HorizontalBar} from 'react-chartjs-2';


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


var options = {
  scales: {
    yAxes: [{
      afterFit: function(scaleInstance) {
        scaleInstance.width = 90; // sets the width to 100px
      },
      barThickness: 21
    }],
    xAxes: [{
      barThickness: 2,
                  ticks: {
                min: 0,
                beginAtZero: true
            }

    }],


  }
};
class GetContract extends Component {

  constructor(props) {
    super(props);
    console.log("the state is");
    console.log(this.props.params.address);

    console.log("browserHistorylklfsdlsdfdfssldsdf");
    console.log(this.props);

    this.state = {
      contractInfo: '',
      receivedValue: false,
      metricsData : {
        labels: [['End-To-End', 'Deployment'], ['Montgomery', 'conversion'], ['Mining', 'Contract']],
        datasets: [
          {
            label: 'Time in Seconds',
            backgroundColor: '#3DB6ED',
            borderColor: '#3DB6ED',
            borderWidth: 1,
            hoverBackgroundColor: '#98CAE1',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: []
          }
          ]
        },
       getData : {
        labels: [['End-To-End', 'operation'], ['Montgomery', 'conversion'], ['Performing', 'Contract', 'Operation']],
        datasets: [
          {
            label: 'Time in Seconds',
            backgroundColor: '#3DB6ED',
            borderColor: '#3DB6ED',
            borderWidth: 1,
            hoverBackgroundColor: '#98CAE1',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: []
          }
          ]
        },

      contractAddress: this.props.params.address,
      updateValue: 0,
      updateNotification: false
    };


    this.props.dispatch(getContractValue({contractName: "Conference", contractAddress: this.props.params.address, fieldToGet: 'balance'}));

  }


  componentWillReceiveProps(nextProps) {
    console.log("getcontract nextprops......");
    console.log(nextProps);

    if (nextProps.receiveContractValue && !this.state.receivedValue) {
      this.setState(
        {contractInfo: nextProps.receiveContractValue.contracts, 
        receivedValue: true,
        metricsData : {
          labels: [['End-To-End', 'Deployment'], ['Encryption'], ['Mining', 'Contract']],
          datasets: [
            {
              label: 'Time in Seconds',
              backgroundColor: '#3DB6ED',
              borderColor: '#3DB6ED',
              borderWidth: 1,
              hoverBackgroundColor: '#98CAE1',
              hoverBorderColor: '#98CAE1',
              data: [nextProps.receiveContractValue && (nextProps.receiveContractValue.contracts.contract.mined_pythontime + nextProps.receiveContractValue.contracts.contract.mined_blockchaintime).toFixed(4), nextProps.receiveContractValue && nextProps.receiveContractValue.contracts.contract.mined_pythontime.toFixed(4), nextProps.receiveContractValue && nextProps.receiveContractValue.contracts.contract.mined_blockchaintime.toFixed(4)]
            }
            ]
          },

         getData : {
          labels: [['End-To-End', 'operation'], ['Decryption'], ['Performing', 'Contract', 'Operation']],
          datasets: [
            {
              label: 'Time in Seconds',
              backgroundColor: '#3DB6ED',
              borderColor: '#3DB6ED',
              borderWidth: 1,
              hoverBackgroundColor: '#98CAE1',
              hoverBorderColor: '#98CAE1',
              data: [nextProps.receiveContractValue && (nextProps.receiveContractValue.contracts.contract.python_time + nextProps.receiveContractValue.contracts.contract.blockchain_time).toFixed(4), nextProps.receiveContractValue && nextProps.receiveContractValue.contracts.contract.python_time.toFixed(4), nextProps.receiveContractValue && nextProps.receiveContractValue.contracts.contract.blockchain_time.toFixed(4)]
            }
            ]
          }


        });

      setTimeout(() => {
        this.props.dispatch(getContractValue({contractName: "Conference", contractAddress: this.props.params.address, fieldToGet: 'balance'}));
      }, 6000);

    }

    // Check for updated value
    if ((nextProps.receiveContractValue != this.props.receiveContractValue) && this.state.receivedValue) {

      // Check if value updated
      if (nextProps.receiveContractValue.contracts.contract.value != this.props.receiveContractValue.contracts.contract.value) {
        this.setState({contractInfo: nextProps.receiveContractValue.contracts, updateValue: (nextProps.receiveContractValue.contracts.contract.value - this.props.receiveContractValue.contracts.contract.value), updateNotification: true});
      }

      setTimeout(() => {
        this.props.dispatch(getContractValue({contractName: "Conference", contractAddress: this.props.params.address, fieldToGet: 'balance'}));
      }, 6000);


    }

  }

  handleRequestClose = () => {
    this.setState({
      updateNotification: false,
      updateValue: 0
    });
  };


  render() {

    return (

      <MuiThemeProvider>

      <div className="contractSummary">

        <div className="metricsBox">
                <h1 style={{fontSize: 16}}>Contract Deployment Metrics</h1>

                <HorizontalBar data={this.state.metricsData} options={options} width="200" height="250" />

        </div>

        <div className="getBox">
                <h1 style={{fontSize: 16}}>Get Operation Metrics</h1>

                <HorizontalBar data={this.state.getData} options={options} width="200" height="250" />

        </div>

        <div className="summaryBox">

            <div>
              <div className="textBox">
                <TextField className="contractInput" value={this.state.contractAddress} underlineDisabledStyle={styles.input} floatingLabelText="Contract Address" fullWidth={true} disabled={true} floatingLabelFixed={true} />
              </div>

              <br/>

              <div className="textBox">

                <TextField className="contractInput" value={'117724361726052232286642729503619885226396848298440290194474368106181877843301454349676344086382538003780399137832758867778222252201458886767547437337543045586657569159374425258039121862112545733028126116907766250403035801176460752912327774508255666696312630982168986041970059274372378012061526901950296772972'} underlineDisabledStyle={styles.input} floatingLabelText="Public Key" fullWidth={true} floatingLabelFixed={true} disabled={true} />
              </div>

              <br/>

              <div className="textBox">

                <TextField className="contractInput" value={'47980525443061876020527034016411441227194643960510513681010937410836364029459946692501328682288988879636933490245011435684998877231847088799294115530169680532159764430125011371702310221053393033596079811897509778462503208137703278639186152516671532389276888159878118655619742545737851891896315730683541788480'} underlineDisabledStyle={styles.input} floatingLabelText="Private Key" fullWidth={true} floatingLabelFixed={true} disabled={true} />
              </div>

              <br/>

              <div className="textBox">

                <TextField className="contractInput" value={(this.state.receivedValue && this.state.contractInfo) ? this.state.contractInfo.contract.value : 'Requesting...'} underlineDisabledStyle={styles.input} floatingLabelText="Total Expenses" fullWidth={true} floatingLabelFixed={true} disabled={true} />
              </div>

              <br/>

              <div className="textBox">

                <TextField className="contractInput" value={(this.state.receivedValue && this.state.contractInfo && this.state.contractInfo.contract) ? this.state.contractInfo.contract.enc_value : 'Requesting...' } underlineDisabledStyle={styles.input} floatingLabelText="Total Expenses (Encrypted)" fullWidth={true} floatingLabelFixed={true} disabled={true} />
              </div>

              <br/>

            </div>

        </div>

            <Snackbar open={this.state.updateNotification}
              message={"$" + this.state.updateValue + " has been added to total expenses!"}
              autoHideDuration={5000}
              onRequestClose={this.handleRequestClose}/>

      </div>

      </MuiThemeProvider>
    );
  }
}

function mapStateToProps(state) {
  const { receiveContractValue } = state;
  console.log("mapstatetoprops");
  console.log(receiveContractValue);
  return { receiveContractValue };
}


export default connect(mapStateToProps)(GetContract);