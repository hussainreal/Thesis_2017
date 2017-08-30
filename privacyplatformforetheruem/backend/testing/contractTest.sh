#!/bin/bash

# Step 1: User 1 deploys the contract with initial value of 5
curl -i -H "Content-Type: application/json" -X POST -d '{"contractName": "Conference", "fieldToBeEncrypted": "balance", "initialValue": 5, "account": "0xe5f0367760b9cdeec8222ecf102f198ae390c3b8" }' http://localhost:3002/deployContract

# Step 2: User 2 gets the address from User 1 and adds a value of 3 to the contract
curl -i -H "Content-Type: application/json" -X POST -d '{"contractName": "Conference", "contractAddress": "0x2956171007587c83d0858cc1275835e7de072f63", "fieldToAdd": "balance", "addValue": 3, account: "0x0582ffcabbee387508d826737780d39de95423e7"}' http://localhost:3002/addToValueInContract


# Step 3: User 3 gets the address from User 1 and adds a value of 2 to the contract
curl -i -H "Content-Type: application/json" -X POST -d '{"contractName": "Conference", "contractAddress": "0x2956171007587c83d0858cc1275835e7de072f63", "fieldToAdd": "balance", "addValue": 2, account: "0x20e6dd0e0049fcc3454ea451c516cba8b7c093af"}' http://localhost:3002/addToValueInContract

# EXPECTED RESULT = 10

{"contractAddress": "0x2956171007587c83d0858cc1275835e7de072f63"}

{"value":"8"}

{"value":"8"}




