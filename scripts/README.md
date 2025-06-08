# 以太坊私有网络交互脚本

这个脚本集合提供了与您的私有以太坊网络交互的各种工具。

## 🚀 快速开始

```bash
# 运行交互式脚本选择器
./scripts/run-all.sh

# 或者直接使用单个脚本
docker exec -i miner geth attach ~/data/geth.ipc < ./scripts/network-info.js
```

## 📁 脚本说明

### 1. network-info.js - 网络信息查询
- 显示网络基本信息（网络ID、链ID、区块高度等）
- 查看所有账户及其余额
- 显示节点连接信息

### 2. mining-control.js - 挖矿控制面板
**可用函数：**
- `checkMiningStatus()` - 检查当前挖矿状态
- `startMining(threads)` - 开始挖矿（可指定线程数）
- `stopMining()` - 停止挖矿
- `mineBlocks(num)` - 挖指定数量的区块

### 3. transaction-test.js - 交易测试工具
**可用函数：**
- `createAccount(password)` - 创建新账户
- `unlockAccount(account, password, duration)` - 解锁账户
- `sendTransaction(from, to, amount)` - 发送交易
- `quickTransfer(toAddress, amount)` - 快速转账
- `batchTransfer([addresses], amount)` - 批量转账

### 4. simple-contract.js - 智能合约测试
**可用函数：**
- `deployContract()` - 部署简单存储合约
- `interactWithContract(address)` - 连接到已部署的合约
- `getContractEvents(address)` - 查看合约事件

## 💡 使用示例

### 基础操作流程：
```javascript
// 1. 查看网络状态
loadScript("scripts/network-info.js")

// 2. 开始挖矿获得 ETH
loadScript("scripts/mining-control.js")
startMining(1)

// 3. 等待几个区块后停止挖矿
stopMining()

// 4. 进行转账测试
loadScript("scripts/transaction-test.js")
let newAccount = createAccount("password")
quickTransfer(newAccount, "10")

// 5. 部署和测试智能合约
loadScript("scripts/simple-contract.js")
deployContract()
// 等待部署完成后
deployedContract.set(42, {from: eth.coinbase, gas: 100000})
deployedContract.get()
```

### 进阶操作：
```javascript
// 批量创建账户并转账
let accounts = []
for(let i = 0; i < 5; i++) {
    accounts.push(createAccount("password"))
}
batchTransfer(accounts, "5")

// 挖指定数量区块
mineBlocks(10)
```

## 🛠️ 直接进入控制台

如果您想直接使用 Geth 控制台：
```bash
docker exec -it miner geth attach ~/data/geth.ipc
```

然后可以手动加载脚本：
```javascript
loadScript("/workspace/scripts/network-info.js")
loadScript("/workspace/scripts/mining-control.js")
// 等等...
```

## ⚠️ 注意事项

1. **挖矿**: 在进行交易前请确保开始挖矿，否则交易不会被确认
2. **账户解锁**: 发送交易前需要解锁账户
3. **Gas**: 确保账户有足够的 ETH 支付 gas 费用
4. **网络**: 确保您的私有网络正在运行

## 🔧 故障排除

- **"账户解锁失败"**: 检查密码是否正确（默认：password）
- **"余额不足"**: 需要先挖矿获得 ETH
- **"交易失败"**: 确保挖矿正在进行以确认交易
- **"合约部署失败"**: 检查 gas 限制和账户余额 