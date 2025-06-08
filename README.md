# 🚀 区块链课程作业项目 - 众筹平台

这是一个完整的区块链众筹平台项目，包含私有以太坊网络部署和智能合约系统。该项目适用于区块链技术课程作业和学习。

## 🎯 项目概述

本项目包含：
1. **私有以太坊网络**: 支持 MetaMask 和 Remix 连接
2. **智能合约系统**: 功能完整的众筹合约 (33个测试全部通过)
3. **开发工具链**: Hardhat + OpenZeppelin + 完整测试套件
4. **部署文档**: 详细的前后端集成指南

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

## 💻 智能合约系统

### 众筹合约 (Crowdfunding.sol)

本项目的核心是一个功能完整的众筹智能合约系统：

#### 🎯 主要功能
- **项目管理**: 创建、取消众筹项目
- **投资系统**: 多用户投资，自动达标检测
- **资金管理**: 安全提取，平台手续费(2.5%)
- **退款机制**: 项目失败时全额退款
- **平台管理**: 手续费调整，紧急项目管理
- **安全保护**: 重入攻击防护，权限控制

#### 📊 测试状态
- **测试用例**: 33个 (100% 通过)
- **测试覆盖率**: 100%
- **合约版本**: Solidity 0.8.20
- **安全标准**: OpenZeppelin

#### 🚀 部署信息
- **合约地址**: `0x80B654eFD36771339c3Ed2193354b6E164444516`
- **部署状态**: ✅ 已成功部署
- **Gas 消耗**: 2,015,495
- **验证状态**: ✅ 功能完整验证

#### 📁 项目结构
```
contracts/
├── contracts/Crowdfunding.sol     # 主合约
├── test/Crowdfunding.test.js      # 测试套件
├── scripts/deploy.js              # 部署脚本
├── README.md                      # 合约文档
├── TEST_REPORT.md                 # 测试报告
└── deployment-info.json           # 部署信息
```

#### 🔧 快速开始
```bash
cd contracts
npm install
npm run compile
npm run test
npm run deploy-local
```

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

## 🌐 前后端开发指南

### 前端集成建议

#### 技术栈选择
- **React.js + Web3.js**: 适合复杂交互和状态管理
- **Vue.js + ethers.js**: 适合快速开发和轻量级应用
- **Next.js**: 适合需要 SSR 的应用

#### 核心功能实现
```javascript
// 连接钱包
const connectWallet = async () => {
  if (window.ethereum) {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.BrowserProvider(window.ethereum);
    return provider;
  }
};

// 创建项目
const createProject = async (title, description, goal, duration) => {
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const tx = await contract.createProject(title, description, 
    ethers.parseEther(goal), duration);
  return await tx.wait();
};
```

### 后端 API 设计

#### 建议的 API 结构
```
GET    /api/projects              # 获取所有项目
GET    /api/projects/:id          # 获取单个项目详情
POST   /api/projects              # 创建新项目
PUT    /api/projects/:id/cancel   # 取消项目
POST   /api/projects/:id/contribute  # 投资项目
GET    /api/users/:address/projects     # 用户的项目
```

#### 数据库设计
- **用户表**: 地址、昵称、创建时间
- **项目表**: 合约映射、描述、图片、状态
- **投资记录**: 用户、项目、金额、时间
- **交易记录**: 哈希、状态、确认数

## 📋 部署检查清单

### 网络部署 ✅
- [x] 私有以太坊网络运行正常
- [x] RPC 接口可外部访问 (http://152.53.165.85:8545)
- [x] 挖矿功能正常
- [x] MetaMask 连接成功
- [x] Remix IDE 连接成功

### 智能合约 ✅
- [x] 合约编译成功 (Solidity 0.8.20)
- [x] 所有测试通过 (33/33)
- [x] 安全审计完成 (OpenZeppelin 标准)
- [x] 合约部署成功 (0x80B654eFD36771339c3Ed2193354b6E164444516)
- [x] 功能验证完成

### 文档完善 ✅
- [x] 项目 README 编写完成
- [x] 合约文档详细完整
- [x] 测试报告生成
- [x] 前后端集成指南
- [x] API 设计建议

## 🎓 作业提交材料

### 必要文件
1. **项目源码**: 完整的 Git 仓库
2. **部署文档**: README.md (本文件)
3. **合约代码**: contracts/contracts/Crowdfunding.sol
4. **测试报告**: contracts/TEST_REPORT.md
5. **部署信息**: contracts/deployment-info.json

### 演示内容
1. **网络搭建**: 私有链部署和外部连接
2. **合约功能**: 创建项目、投资、提取、退款
3. **安全特性**: 权限控制、重入防护
4. **测试验证**: 100% 测试覆盖率
5. **前端集成**: MetaMask 和 Web3 交互

### 技术亮点
- ✨ 完整的去中心化众筹平台
- ✨ 企业级安全标准 (OpenZeppelin)
- ✨ 100% 测试覆盖率
- ✨ 详细的开发文档
- ✨ 前后端集成指南

## 📞 支持与联系

### 问题排查
如有问题，请按以下步骤检查：
1. 网络连接状态: `curl http://152.53.165.85:8545`
2. 合约部署状态: 查看 deployment-info.json
3. 测试执行结果: `npm run test`
4. 容器运行状态: `docker ps`

### 常见问题
- **连接失败**: 检查防火墙和端口 8545
- **部署失败**: 确认账户余额和 Gas 费用
- **测试失败**: 验证网络配置和合约地址

## 📄 许可证

MIT License - 本项目仅供教育和学习使用

---

## 🎉 项目完成总结

**恭喜！你已经完成了一个功能完整的区块链众筹项目！**

### 🏆 项目成就
✅ **私有以太坊网络**: 成功搭建并运行  
✅ **智能合约系统**: 众筹合约开发完成  
✅ **安全标准**: OpenZeppelin 企业级安全  
✅ **测试覆盖**: 33个测试用例 100% 通过  
✅ **文档完善**: 详细的开发和集成文档  
✅ **实际部署**: 合约成功部署到私有网络  

### 🔧 技术栈掌握
- **区块链技术**: Ethereum, Geth, 挖矿机制
- **智能合约**: Solidity 0.8.20, OpenZeppelin
- **开发工具**: Hardhat, Mocha, Chai
- **前端集成**: Web3.js, ethers.js, MetaMask
- **部署运维**: Docker, 网络配置, RPC 接口

**这个项目展示了从底层网络搭建到智能合约开发的完整区块链技术栈！** 🚀
