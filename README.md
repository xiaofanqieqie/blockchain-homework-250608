
### 拉镜像
docker pull ethereum/client-go:v1.8.12

### 创建网络
docker network create -d bridge --subnet=172.26.0.0/16 ethnet
docker network ls

### 运行docker网络
docker compose up -d --build

### 在容器内的/workspace目录创建文件
mkdir -p /workspacedapp
mkdir -p /workspace/dapp/miner
mkdir -p /workspace/dapp/data
touch /workspace/dapp/genesis.json


### 创建账户
geth -datadir /workspace/dapp/miner/data account new


Passphrase: password

### 创建的账户
1184a8e4007f05c34e8610fde3d741f1bedebace


### 创建主矿工节点:
创建一个文件：
vi /opt/docker-project/eth/workspace/dapp/init.sh

```
geth -datadir ~/data/ init /workspace/dapp/data/genesis.json

if [  $# -lt 1 ]; then 
  exec "/bin/sh"
else
  exec /bin/sh -c "$@"
fi
```

创建自动运行的脚本:
vi ./opt/docker-project/eth/workspace/dapp/mine.sh
account='1184a8e4007f05c34e8610fde3d741f1bedebace'
cp -r /workspace/dapp/miner/data/keystore/* ~/data/keystore/
geth -datadir ~/data/ --networkid 88 --rpc --rpcaddr "172.19.0.50" --rpcapi admin,eth,miner,web3,personal,net,txpool --unlock ${account} --etherbase ${account} console

### 创建主矿工节点:
chmod +x ./opt/docker-project/eth/workspace/dapp/init.sh
chmod +x ./opt/docker-project/eth/workspace/dapp/mine.sh
docker compose -f master-miner-docker-compose.yml up -d --build


### 创建从矿工节点:
vi ./opt/docker-project/eth/workspace/dapp/node.sh
```
cp -r /workspace/dapp/miner/data/keystore/* ~/data/keystore/
geth -datadir ~/data/ --networkid 88 console
```

chmod +x ./opt/docker-project/eth/workspace/dapp/node.sh
docker compose -f worker-node-docker-compose.yml up -d --build


### 连接主节点: 
```
docker exec -it miner geth attach ~/data/geth.ipc
```

### 查看节点信息:
```
admin.nodeInfo.enode
```