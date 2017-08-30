# Smartcontract Application

Smartcon-app provides the frontend implementation (in [Reactjs](https://facebook.github.io/react/)) that aims to allows users the ability to create smart contracts from a set of templates and deploy these smart contracts onto a private Ethereum Network.

## Installation

Clone this git repository

```console
git clone https://ali_aamir@bitbucket.org/DesignProjectA/truffleapp.git
```
Cd into this directory and install the required npm dependencies

```console
npm install
```

Run application

```console
npm start
```

## Usage

Once the application is running on your localhost (by default port 3000), navigate to /contracts in order to see all contract templates.
Select on a template in order to see the associated contract fields with that contract template.

> Note a precondition for creating a smart contract on this application is tha the backend application is up and running and the blockchain is online.

Simply deploy contract when fields have been committed and it will be sent to the backend application.

## Layout for src

```.
├── App.js
├── App.test.js
├── account.js
├── actions
│   └── actions.js
├── contracts.js
├── encryptiondemo.js
├── expensescontract.js
├── getcontract.js
├── home.js
├── index.js
├── login.js
├── moviecontract.js
├── navbar.js
├── navbarHome.js
├── reducers
│   └── reducers.js
├── setcontract.js
├── styles
│   ├── App.css
│   ├── Contract.css
│   └── index.css
├── successfulpost.js
├── templates
├── transactions.js
├── tree.txt
└── viewcontracts.js

5 directories, 55 files

```
> Note that project utilizes the [flux](https://bitbucket.org/DesignProjectA/truffleapp/src/3e335e01e27546a80b68a502bb5aac0305916f64/smartcon-app/README.md?at=master&fileviewer=file-view-default)
application layout for managing data, this is contained in the actions/ and reducers/ folders




## Apis/endpoints in use

To post a contract to backend

'http://ethnode1.canadaeast.cloudapp.azure.com:3001/deployContract'

Arguments taken:

'{"contractName": "Conference", "fieldToBeEncrypted": "balance", "initialValue": 5 }'

Response:

A contract transaction number is returned. Note that this is not the contract address traditionally associated with a contract deployed
onto an Ethereum node, but rather a tx number in order to track when the contract is finally deployed onto the network.

Get value from an existing contract 

'http://ethnode1.canadaeast.cloudapp.azure.com:3001/getValueFromContract'

Arguments taken:

'{"contractAddress": "0x2956171007587c83d0858cc1275835e7de072f63",  "fieldToGet": "balance"}'

Response:

Value from requested contract field.

Add value to an existing contract

'http://ethnode1.canadaeast.cloudapp.azure.com:3001/addToValueInContract'

Arguments taken:

'{"contractAddress": "0x2956171007587c83d0858cc1275835e7de072f63",  "fieldToAdd": "balance", "addValue": 4}'

To get all deployed contracts

'http://ethnode1.canadaeast.cloudapp.azure.com:3001/getAllContracts'

# Design Decisions

## Frontend Framework

We utilized [Reactjs](https://facebook.github.io/react/) as a framework for our frontend.

We decided to use React over other frameworks because it was very lightweight (in terms of overhead associated with framework i.e. more of a library) and had a very simple api to design complex ui capabilities.


## Application layout for data

We decided to use the [Redux](http://redux.js.org/) which is an implementation of flux, as our architecture for handling unidirectional data flow.
See the image below for how flux/redux operates.

We decided to use this architecture largely because it allowed us the ability to scale the application's data endpoints in a centralized location.

Ex.
An application architecture for React utilizing a unidirectional data flow.

![Alt Text]("https://bitbucket.org/DesignProjectA/truffleapp/src/assets/flux-diagram-white-background.png")