# 🚀 部署指南

## 📋 部署前准备

### 1. 环境检查
```bash
# 检查 Node.js 版本 (需要 >= 16)
node --version

# 检查网络连接
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"net_version","params":[],"id":1}' \
  http://152.53.165.85:8545
```

### 2. 安装依赖
```bash
cd contracts
npm install
```

### 3. 编译合约
```bash
npx hardhat compile
```

## 🎯 部署步骤

### 方法一：自动部署 (推荐)
```bash
# 部署到私有网络
npx hardhat run scripts/deploy.js --network private

# 部署到本地网络
npx hardhat run scripts/deploy.js --network localhost
```

### 方法二：手动部署
```bash
# 启动 Hardhat 控制台
npx hardhat console --network private

# 在控制台中执行
const Crowdfunding = await ethers.getContractFactory("Crowdfunding");
const crowdfunding = await Crowdfunding.deploy("0x1184a8E4007f05c34e8610fdE3d741F1BEDeBace");
await crowdfunding.waitForDeployment();
console.log("合约地址:", await crowdfunding.getAddress());
```

## 📊 部署结果

部署成功后会看到类似输出：
```
🚀 开始部署众筹智能合约...

📝 部署账户: 0x1184a8E4007f05c34e8610fdE3d741F1BEDeBace
💰 账户余额: 3414.001008824 ETH

🏦 平台钱包地址: 0x1184a8E4007f05c34e8610fdE3d741F1BEDeBace
📦 部署中...
✅ 众筹合约部署成功!
📍 合约地址: 0x74785B0A9EE496968d01F5B924BA3B9AF9C99b42
🔗 交易哈希: 0x9749d067e6e97bdb9b5e6411d38b1af11d4e6db11041c62784119cbea31ad703
⛽ Gas 使用量: 1980324

🔍 验证部署...
📊 当前项目总数: 0
💸 平台手续费率: 2.5 %

🎉 部署完成!
💾 部署信息已保存到 deployment-info.json
```

## 📁 部署信息文件

部署成功后会自动生成 `deployment-info.json`：
```json
{
  "contractName": "Crowdfunding",
  "contractAddress": "0x74785B0A9EE496968d01F5B924BA3B9AF9C99b42",
  "deployer": "0x1184a8E4007f05c34e8610fdE3d741F1BEDeBace",
  "platformWallet": "0x1184a8E4007f05c34e8610fdE3d741F1BEDeBace",
  "transactionHash": "0x9749d067e6e97bdb9b5e6411d38b1af11d4e6db11041c62784119cbea31ad703",
  "gasUsed": "1980324",
  "timestamp": "2025-06-08T09:48:32.395Z",
  "network": "private"
}
```

## 🔧 部署配置

### 修改平台钱包地址
编辑 `scripts/deploy.js` 第15行：
```javascript
const platformWallet = "0x你的钱包地址"; // 替换为实际地址
```

### 修改网络配置
编辑 `hardhat.config.js`：
```javascript
networks: {
  yourNetwork: {
    url: "http://你的节点地址:端口",
    chainId: 你的链ID,
    accounts: ["0x你的私钥"]
  }
}
```

## ✅ 部署验证

### 1. 运行测试验证
```bash
npm test
```

### 2. 交互式验证
```bash
npx hardhat run scripts/interactive-test.js --network private
```

### 3. 手动验证
```bash
npx hardhat console --network private

# 连接到已部署的合约
const address = "0x74785B0A9EE496968d01F5B924BA3B9AF9C99b42";
const Crowdfunding = await ethers.getContractFactory("Crowdfunding");
const crowdfunding = Crowdfunding.attach(address);

# 验证基本功能
await crowdfunding.getTotalProjects(); // 应该返回 0
await crowdfunding.platformFeeRate(); // 应该返回 250 (2.5%)
```

## 🚨 常见问题

### 部署失败
- **余额不足**: 确保部署账户有足够ETH支付gas费
- **网络连接**: 检查网络配置和节点连接
- **私钥错误**: 验证私钥格式和权限

### Gas 费用过高
```javascript
// 在 hardhat.config.js 中调整
gas: 2100000,
gasPrice: 8000000000  // 降低 gasPrice
```

### 合约验证失败
```bash
# 重新编译
npx hardhat clean
npx hardhat compile

# 检查 Solidity 版本
npx hardhat --version
```

## 📝 部署清单

- [ ] 环境准备完成
- [ ] 依赖安装完成  
- [ ] 合约编译成功
- [ ] 网络配置正确
- [ ] 账户余额充足
- [ ] 部署脚本执行成功
- [ ] 部署信息文件生成
- [ ] 功能验证通过
- [ ] 测试用例全部通过

## 🔄 重新部署

如果需要重新部署：
```bash
# 清理缓存
npx hardhat clean

# 重新编译
npx hardhat compile

# 重新部署
npx hardhat run scripts/deploy.js --network private
```

## 📞 技术支持

遇到问题时：
1. 检查 `deployment-info.json` 文件
2. 查看控制台错误信息
3. 运行 `npm test` 验证合约功能
4. 检查网络连接状态
