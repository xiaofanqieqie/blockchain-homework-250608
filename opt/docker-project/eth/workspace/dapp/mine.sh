#!/bin/sh
account='1184a8e4007f05c34e8610fde3d741f1bedebace'
mkdir -p ~/data/keystore/
cp -r /workspace/dapp/miner/data/keystore/* ~/data/keystore/
geth -datadir ~/data/ --networkid 88 --rpc --rpcaddr "172.26.0.50" --rpcport 8545 --rpcapi admin,eth,miner,web3,personal,net,txpool --rpcvhosts="*" --rpccorsdomain="*" --unlock ${account} --password /workspace/dapp/password.txt --etherbase ${account} console