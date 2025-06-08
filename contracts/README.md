# 众筹智能合约系统 (Crowdfunding Smart Contract)

## 📋 项目概述

这是一个基于以太坊的去中心化众筹平台智能合约系统，支持项目创建、投资、资金管理和退款等完整功能。该项目是区块链课程作业的核心组件。

### 🎯 主要功能

- **项目管理**: 创建、取消众筹项目
- **投资系统**: 多用户投资，自动达标检测
- **资金管理**: 安全提取，平台手续费(2.5%)
- **退款机制**: 项目失败时全额退款
- **平台管理**: 手续费调整，紧急项目管理
- **安全保护**: 重入攻击防护，权限控制

## 🏗️ 项目结构

```
contracts/
├── contracts/
│   └── Crowdfunding.sol          # 主要合约文件
├── scripts/
│   └── deploy.js                 # 部署脚本
├── test/
│   └── Crowdfunding.test.js      # 测试文件 (33个测试用例)
├── hardhat.config.js             # Hardhat 配置
├── package.json                  # 项目依赖
├── deployment-info.json          # 部署信息(自动生成)
└── README.md                     # 项目文档
```

## 🔧 技术栈

- **Solidity**: 0.8.20
- **开发框架**: Hardhat
- **测试库**: Chai, Mocha
- **安全库**: OpenZeppelin
- **网络**: 私有以太坊网络 (Chain ID: 88)

## 📦 依赖安装

```bash
# 安装依赖
npm install

# 或使用 yarn
yarn install
```

## ⚙️ 配置说明

### Hardhat 网络配置

```javascript
networks: {
  localhost: {
    url: "http://152.53.165.85:8545",
    chainId: 88,
    accounts: "remote"
  },
  private: {
    url: "http://152.53.165.85:8545", 
    chainId: 88,
    gas: 2100000,
    gasPrice: 8000000000
  }
}
```

### 合约参数

- **最小投资额**: 0.01 ETH
- **最小目标金额**: 0.1 ETH  
- **项目持续时间**: 1-90 天
- **平台手续费率**: 2.5% (可调整，最高10%)
- **最小项目持续时间**: 1 天
- **最大项目持续时间**: 90 天

## 🚀 快速开始

### 1. 编译合约

```bash
npm run compile
```

### 2. 运行测试

```bash
npm run test
```

### 3. 部署到私有网络

```bash
npm run deploy-local
```

### 4. 部署到指定网络

```bash
npm run deploy-private
```

## 🧪 测试报告

### 测试覆盖率: 100%
### 通过测试: 33/33

#### 测试分类:

1. **合约部署测试** (4个)
   - ✅ 正确设置合约所有者
   - ✅ 正确设置平台钱包
   - ✅ 设置正确的平台手续费率
   - ✅ 拒绝零地址作为平台钱包

2. **项目创建测试** (6个)
   - ✅ 成功创建项目
   - ✅ 拒绝空标题
   - ✅ 拒绝空描述  
   - ✅ 拒绝过低的目标金额
   - ✅ 拒绝过短的持续时间
   - ✅ 拒绝过长的持续时间

3. **投资功能测试** (6个)
   - ✅ 允许用户投资
   - ✅ 达到目标时标记项目成功
   - ✅ 拒绝创建者投资自己的项目
   - ✅ 拒绝低于最小金额的投资
   - ✅ 拒绝向不存在项目投资
   - ✅ 正确追踪多个投资者

4. **资金提取测试** (3个)
   - ✅ 允许创建者提取成功项目资金
   - ✅ 拒绝非创建者提取资金
   - ✅ 拒绝重复提取资金

5. **退款功能测试** (3个)
   - ✅ 允许项目失败后退款
   - ✅ 拒绝无投资用户申请退款
   - ✅ 拒绝项目成功后申请退款

6. **项目取消测试** (2个)
   - ✅ 允许创建者取消项目
   - ✅ 拒绝非创建者取消项目

7. **查询功能测试** (3个)
   - ✅ 正确计算项目成功率
   - ✅ 返回用户创建的项目列表
   - ✅ 返回用户参与的项目列表

8. **管理员功能测试** (4个)
   - ✅ 允许所有者更新平台手续费率
   - ✅ 拒绝非所有者更新手续费率
   - ✅ 拒绝设置超过10%的手续费率
   - ✅ 允许所有者紧急标记项目失败

9. **安全性测试** (2个)
   - ✅ 拒绝直接以太币转账
   - ✅ 防止重入攻击

## 📊 部署信息

最新部署信息存储在 `deployment-info.json` 文件中:

```json
{
  "contractName": "Crowdfunding",
  "contractAddress": "0x80B654eFD36771339c3Ed2193354b6E164444516",
  "deployer": "0x1184a8E4007f05c34e8610fdE3d741F1BEDeBace",
  "platformWallet": "0x1184a8E4007f05c34e8610fdE3d741F1BEDeBace",
  "network": "localhost",
  "timestamp": "2025-06-08T08:28:10.962Z"
}
```

## 🔍 合约功能详解

### 1. 项目创建 (`createProject`)

```solidity
function createProject(
    string memory _title,
    string memory _description, 
    uint256 _goalAmount,
    uint256 _durationInDays
) external returns (uint256)
```

**参数验证:**
- 标题和描述不能为空
- 目标金额 ≥ 0.1 ETH
- 持续时间: 1-90 天

### 2. 投资功能 (`contribute`)

```solidity
function contribute(uint256 _projectId) external payable
```

**限制条件:**
- 最小投资 0.01 ETH
- 创建者不能投资自己的项目
- 项目必须处于活跃状态
- 未超过截止日期

### 3. 资金提取 (`withdrawFunds`)

```solidity
function withdrawFunds(uint256 _projectId) external
```

**提取条件:**
- 仅项目创建者可调用
- 项目必须成功(达到目标金额)
- 资金未被提取过
- 自动扣除2.5%平台手续费

### 4. 申请退款 (`requestRefund`)

```solidity
function requestRefund(uint256 _projectId) external
```

**退款条件:**
- 项目失败或超过截止日期未达标
- 用户有投资记录
- 全额退款，无手续费

### 5. 查询功能

- `getProject()`: 获取项目详细信息
- `getUserContribution()`: 查询用户投资金额
- `getProjectContributors()`: 获取项目投资者列表
- `getUserCreatedProjects()`: 获取用户创建的项目
- `getUserParticipatedProjects()`: 获取用户参与的项目
- `getProjectSuccessRate()`: 计算平台项目成功率

## 🔐 安全特性

### 1. 访问控制
- 基于 OpenZeppelin `Ownable` 模式
- 项目创建者权限控制
- 平台管理员权限分离

### 2. 重入攻击防护
- 使用 OpenZeppelin `ReentrancyGuard`
- 所有资金操作都有重入保护

### 3. 输入验证
- 所有参数都有完整的验证逻辑
- 防止恶意输入和边界情况

### 4. 状态管理
- 严格的项目状态转换
- 防止无效状态操作

## 🌐 前端集成指南

### Web3.js 集成示例

```javascript
const Web3 = require('web3');
const web3 = new Web3('http://152.53.165.85:8545');

const contractAddress = '0x80B654eFD36771339c3Ed2193354b6E164444516';
const contractABI = [/* ABI from artifacts */];

const contract = new web3.eth.Contract(contractABI, contractAddress);

// 创建项目
await contract.methods.createProject(
    "项目标题",
    "项目描述", 
    web3.utils.toWei("1", "ether"),
    30
).send({ from: userAddress });

// 投资项目
await contract.methods.contribute(projectId).send({
    from: userAddress,
    value: web3.utils.toWei("0.1", "ether")
});
```

### ethers.js 集成示例

```javascript
const { ethers } = require('ethers');

const provider = new ethers.JsonRpcProvider('http://152.53.165.85:8545');
const signer = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(contractAddress, contractABI, signer);

// 查询项目信息
const project = await contract.getProject(projectId);
console.log(project);

// 监听事件
contract.on("ProjectCreated", (projectId, creator, title) => {
    console.log(`新项目创建: ${title} by ${creator}`);
});
```

## 📋 事件列表

```solidity
event ProjectCreated(uint256 indexed projectId, address indexed creator, string title);
event ContributionMade(uint256 indexed projectId, address indexed contributor, uint256 amount, uint256 totalAmount);
event ProjectSuccessful(uint256 indexed projectId, uint256 totalAmount);
event ProjectFailed(uint256 indexed projectId, uint256 totalAmount);
event FundsWithdrawn(uint256 indexed projectId, address indexed creator, uint256 amount, uint256 platformFee);
event RefundIssued(uint256 indexed projectId, address indexed contributor, uint256 amount);
event PlatformFeeUpdated(uint256 oldRate, uint256 newRate);
```

## 🚀 后端 API 设计建议

### 1. 项目相关 API

```
GET    /api/projects              # 获取所有项目
GET    /api/projects/:id          # 获取单个项目详情
POST   /api/projects              # 创建新项目
PUT    /api/projects/:id/cancel   # 取消项目
```

### 2. 投资相关 API

```
POST   /api/projects/:id/contribute  # 投资项目
POST   /api/projects/:id/withdraw    # 提取资金
POST   /api/projects/:id/refund      # 申请退款
```

### 3. 用户相关 API

```
GET    /api/users/:address/projects     # 用户创建的项目
GET    /api/users/:address/contributions # 用户投资的项目
GET    /api/users/:address/balance      # 用户余额信息
```

## 🔧 开发建议

### 1. 前端框架选择
- **React.js + Web3.js**: 适合复杂交互
- **Vue.js + ethers.js**: 适合快速开发
- **Next.js**: 适合 SSR 需求

### 2. 状态管理
- 使用 Redux/Vuex 管理区块链状态
- 监听合约事件更新 UI 状态
- 处理网络延迟和确认时间

### 3. 用户体验优化
- 添加加载状态和进度条
- 提供交易状态跟踪
- 错误处理和用户友好的提示

## 📝 部署注意事项

1. **网络配置**: 确保连接到正确的网络
2. **Gas 费用**: 部署成本约 2,015,495 gas
3. **权限设置**: 正确配置平台钱包地址
4. **测试验证**: 部署前必须通过所有测试

## 🆘 故障排除

### 常见问题:

1. **编译错误**: 检查 Solidity 版本兼容性
2. **部署失败**: 验证网络连接和账户余额
3. **测试失败**: 确认网络配置和合约地址
4. **交互错误**: 检查 ABI 和合约地址

### 联系支持:
- 查看测试日志获取详细错误信息
- 检查 deployment-info.json 获取部署状态
- 验证网络连接: `curl http://152.53.165.85:8545`

---

## 📄 许可证

MIT License - 仅供教育和学习使用

## 👥 贡献

这是区块链课程作业项目，欢迎提出改进建议和反馈。 