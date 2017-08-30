#!/bin/bash

geth --nodiscover --maxpeers 2 --identity "EthNode1" --rpc --rpcaddr "0.0.0.0" --rpcport "8080" --rpccorsdomain "*" --datadir "chains/devtest" --port "2402" --ipcapi "admin,db,eth,debug,miner,net,shh,txpool,personal,web3" --rpcapi "db,eth,net,web3" --networkid 496 console>>/home/capstone/test/geth.log

geth --datadir chains/devtest
