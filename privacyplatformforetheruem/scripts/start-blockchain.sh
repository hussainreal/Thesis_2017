#!/bin/bash

geth --fast --maxpeers 3 --identity "Ethnode1" --rpc --rpcaddr "0.0.0.0" --rpcport "8555" --rpccorsdomain "*" --datadir "chains/devtest" --port "30303" --ipcapi "admin,db,eth,debug,miner,net,shh,txpool,personal,web3" --rpcapi "db,eth,net,web3,personal" --networkid 496 --targetgaslimit 60000000 --mine --minerthreads 1 console 2

geth --datadir chains/devtest
