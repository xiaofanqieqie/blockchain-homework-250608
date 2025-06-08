#!/bin/sh
account='1184a8e4007f05c34e8610fde3d741f1bedebace'
mkdir -p ~/data/keystore/
cp -r /workspace/dapp/miner/data/keystore/* ~/data/keystore/
geth -datadir ~/data/ --networkid 88 --http --http.addr "0.0.0.0" --http.port 8545 --http.api admin,eth,miner,web3,personal,net,txpool --http.vhosts="*" --http.corsdomain="*" --allow-insecure-unlock --unlock ${account} --password /workspace/dapp/password.txt --miner.etherbase ${account} console