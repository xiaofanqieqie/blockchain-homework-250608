# 🚀 私有以太坊区块链部署指南

本项目创建一个支持 MetaMask 和 Remix 连接的私有以太坊网络。

## 📋 网络配置信息

- **网络ID**: 88
- **链ID**: 88  
- **RPC地址**: http://152.53.165.85:8545
- **主账户**: 0x1184a8e4007f05c34e8610fde3d741f1bedebace
- **账户密码**: password

## 🛠️ 部署步骤

### 1. 准备工作

#### 拉取镜像
```bash
docker pull ethereum/client-go:v1.10.26
```

#### 创建网络
```bash
docker network create -d bridge --subnet=172.26.0.0/16 ethnet
docker network ls
```

### 2. 初始化区块链

#### 创建必要目录
```bash
mkdir -p /workspace/dapp
mkdir -p /workspace/dapp/miner/data
mkdir -p /workspace/dapp/data
```

#### 创建账户
```bash
geth -datadir /workspace/dapp/miner/data account new
# 输入密码: password
# 生成账户: 1184a8e4007f05c34e8610fde3d741f1bedebace
```

### 3. 配置文件

#### 创世区块配置 (genesis.json)
已配置支持多个EIP升级，确保与新版本Geth兼容。

#### 启动脚本 (mine.sh)
使用新的HTTP RPC配置，支持外部连接和MetaMask。

#### 密码文件 (password.txt)
包含账户解锁密码。

### 4. 启动区块链

#### 构建并启动主矿工节点
```bash
docker compose -f master-miner-docker-compose.yml up -d --build
```

#### 检查容器状态
```bash
docker ps
docker logs miner --tail 20
```

### 5. 启动挖矿

#### 进入Geth控制台
```bash
docker exec -it miner geth attach ~/data/geth.ipc
```

#### 在控制台中执行
```javascript
// 检查账户状态
eth.coinbase
web3.fromWei(eth.getBalance(eth.coinbase), "ether")

// 启动挖矿
miner.start()

// 确认挖矿状态
eth.mining
eth.blockNumber
```

## 🌐 外部连接

### MetaMask 连接

1. **添加自定义网络**:
   - 网络名称: 私有以太坊网络
   - RPC URL: `http://152.53.165.85:8545`
   - 链ID: `88`
   - 货币符号: ETH

2. **导入账户**:
   - 使用私钥导入或连接硬件钱包
   - 主账户地址: `0x1184a8e4007f05c34e8610fde3d741f1bedebace`

### Remix IDE 连接

1. **打开 Remix**: https://remix.ethereum.org

2. **连接配置**:
   - 点击 **"Deploy & Run Transactions"** 标签
   - Environment 选择: **"Injected Provider - MetaMask"**
   - 或选择: **"Web3 Provider"**
   - Web3 Provider Endpoint: `http://152.53.165.85:8545`

3. **验证连接**:
   - 网络ID显示: 88
   - 账户地址和余额正确显示

## 💻 智能合约开发

### HelloWorld 合约示例

1. **创建合约文件** `HelloWorld.sol`:
```solidity
pragma solidity ^0.4.18;

contract HelloWorld {
    string private message;
    address public owner;
    
    event MessageChanged(string newMessage, address changedBy);
    
    function HelloWorld() public {
        message = "Hello, World!";
        owner = msg.sender;
    }
    
    function setMessage(string _message) public {
        message = _message;
        MessageChanged(_message, msg.sender);
    }
    
    function getMessage() public view returns (string) {
        return message;
    }
    
    function getOwner() public view returns (address) {
        return owner;
    }
}
```

2. **编译设置**:
   - Solidity版本: 0.4.18
   - EVM版本: istanbul 或 byzantium（避免 prague 兼容性问题）

3. **部署合约**:
   - 确保挖矿已启动
   - Gas Limit: 建议 500000+
   - 部署成功后可在 "Deployed Contracts" 中交互

## 🔧 常用命令

### Geth 控制台命令
```javascript
// 账户管理
eth.accounts
eth.coinbase
personal.listWallets

// 余额查询
eth.getBalance(eth.coinbase)
web3.fromWei(eth.getBalance("0x地址"), "ether")

// 挖矿控制
miner.start()
miner.stop()
eth.mining
eth.hashrate

// 网络信息
net.version
admin.nodeInfo
eth.blockNumber
```

### Docker 管理
```bash
# 重启区块链
docker compose -f master-miner-docker-compose.yml restart

# 查看日志
docker logs miner --tail 50

# 进入容器
docker exec -it miner sh

# 停止服务
docker compose -f master-miner-docker-compose.yml down
```

## 🛠️ 故障排除

### 连接问题
- **无法连接RPC**: 检查容器是否运行，端口8545是否开放
- **MetaMask链ID错误**: 确保使用正确的genesis.json重新初始化数据库
- **Remix连接失败**: 验证RPC URL和网络配置

### 部署问题
- **Gas estimation失败**: 确保挖矿已启动，账户有足够ETH
- **交易未确认**: 检查挖矿状态，等待区块生成
- **合约部署失败**: 调整EVM版本为兼容版本

### 挖矿问题
- **挖矿无法启动**: 检查账户是否正确解锁
- **没有挖矿奖励**: 确认etherbase设置正确
- **算力为0**: 等待DAG生成完成

## 📊 网络监控

### 基本信息查看
```bash
# 外部连接测试
cd scripts
npm install
npm test

# 查看详细网络信息
loadScript("/workspace/scripts/network-info.js")
```

### 性能指标
- 当前区块高度
- 挖矿算力
- 交易池状态
- 网络连接数

## 🎯 项目特点

✅ **完全私有化**: 独立的区块链网络，不依赖公网  
✅ **MetaMask支持**: 可直接添加为自定义网络  
✅ **Remix兼容**: 支持智能合约开发和部署  
✅ **可定制性**: 可调整网络参数、账户配置等  
✅ **开发友好**: 内置测试脚本和管理工具  

## 📝 注意事项

1. **安全提醒**: 仅用于开发测试，私钥和密码请妥善保管
2. **网络隔离**: 此为私有网络，与以太坊主网完全独立
3. **数据持久化**: 容器重启不会丢失区块链数据
4. **端口开放**: 确保防火墙允许8545端口访问

---

🚀 **现在你就拥有了一个完整的私有以太坊开发环境！**
