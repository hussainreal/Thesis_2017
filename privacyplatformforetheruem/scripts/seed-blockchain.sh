#!/bin/bash
geth --nodiscover --maxpeers 1 --identity "EthNode2"  --rpc --rpcport "8080" --rpccorsdomain "*"  --port "30303" --ipcapi "admin,db,eth,debug,miner,net,shh,txpool,personal,web3" --rpcapi "db,eth,net,web3" --networkid 496 --datadir "chains/devtest" --targetgaslimit 60000000 init lab-seed.json

geth --datadir chains/devtest

