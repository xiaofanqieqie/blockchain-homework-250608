#!/bin/sh

mkdir -p ~/data/keystore/
cp -r /workspace/dapp/miner/data/keystore/* ~/data/keystore/
geth -datadir ~/data/ --networkid 88 console