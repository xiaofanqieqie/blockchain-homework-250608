# 🚀 众筹智能合约 (Crowdfunding Smart Contract)

基于 Solidity 0.8.20 开发的去中心化众筹平台智能合约。

## 📋 功能特性

### 🎯 核心功能
- ✅ **项目创建**: 用户可以创建众筹项目，设定目标金额和时间期限
- ✅ **资金投入**: 支持多用户投资，实时追踪资金总额
- ✅ **自动达成**: 达到目标金额时自动标记为成功
- ✅ **安全提取**: 项目成功后创建者可提取资金（扣除平台手续费）
- ✅ **退款保障**: 未达到目标时投资者可申请全额退款
- ✅ **项目管理**: 创建者可主动取消项目

### 🔒 安全特性
- ✅ **防重入攻击**: 使用 OpenZeppelin 的 ReentrancyGuard
- ✅ **权限控制**: 基于 Ownable 的管理员功能
- ✅ **数学安全**: 使用 SafeMath 防止溢出
- ✅ **状态验证**: 严格的状态检查和修饰符
- ✅ **事件记录**: 完整的链上事件日志

### 📊 查询功能
- ✅ **项目详情**: 获取项目完整信息
- ✅ **用户投资**: 查看用户投资记录
- ✅ **统计数据**: 项目成功率、总数等统计
- ✅ **投资者列表**: 项目投资者地址列表

## 🛠️ 快速开始

### 1. 安装依赖
```bash
cd contracts
npm install
```

### 2. 编译合约
```bash
npm run compile
```

### 3. 运行测试
```bash
npm run test
```

### 4. 部署到私有网络
```bash
# 修改 hardhat.config.js 中的私钥配置
npm run deploy -- --network private
```

### 5. 部署到本地测试网络
```bash
npm run deploy-local
```

## 📝 合约使用

### 创建项目
```javascript
// 创建一个目标1 ETH，持续30天的项目
await crowdfunding.createProject(
    "我的产品", 
    "产品详细描述", 
    ethers.utils.parseEther("1"), 
    30
);
```

### 投资项目
```javascript
// 向项目ID为1的项目投资0.1 ETH
await crowdfunding.contribute(1, {
    value: ethers.utils.parseEther("0.1")
});
```

### 提取资金
```javascript
// 项目成功后创建者提取资金
await crowdfunding.withdrawFunds(1);
```

### 申请退款
```javascript
// 项目失败后申请退款
await crowdfunding.requestRefund(1);
```

## 🔧 配置参数

| 参数 | 值 | 说明 |
|------|-----|------|
| 最小目标金额 | 0.1 ETH | 项目最小众筹目标 |
| 最小投资金额 | 0.01 ETH | 单次最小投资额度 |
| 最短持续时间 | 1 天 | 项目最短众筹时间 |
| 最长持续时间 | 90 天 | 项目最长众筹时间 |
| 平台手续费率 | 2.5% | 成功项目的平台费率 |

## 📊 项目状态

```javascript
enum ProjectStatus {
    Active,     // 0 - 进行中
    Successful, // 1 - 成功
    Failed,     // 2 - 失败
    Withdrawn   // 3 - 已提取
}
```

## 🔍 主要函数

### 创建与管理
- `createProject()` - 创建众筹项目
- `cancelProject()` - 取消项目
- `contribute()` - 投资项目
- `withdrawFunds()` - 提取资金
- `requestRefund()` - 申请退款

### 查询函数
- `getProject()` - 获取项目详情
- `getTotalProjects()` - 获取项目总数
- `getUserContribution()` - 获取用户投资金额
- `getUserCreatedProjects()` - 获取用户创建的项目
- `getUserParticipatedProjects()` - 获取用户参与的项目
- `getProjectSuccessRate()` - 获取平台成功率

### 管理员函数
- `updatePlatformFeeRate()` - 更新手续费率
- `updatePlatformWallet()` - 更新平台钱包
- `emergencyFailProject()` - 紧急终止项目

## 🧪 测试覆盖

测试涵盖以下场景：
- ✅ 合约部署和初始化
- ✅ 项目创建的各种边界条件
- ✅ 投资功能和状态更新
- ✅ 资金提取和手续费计算
- ✅ 退款机制和失败处理
- ✅ 权限控制和安全性验证
- ✅ 查询功能的正确性
- ✅ 管理员功能测试

运行测试：
```bash
npm run test
```

## 🎯 使用示例

### 在 Remix 中部署
1. 复制 `Crowdfunding.sol` 到 Remix
2. 安装 OpenZeppelin 依赖：
   ```
   @openzeppelin/contracts@4.9.0
   ```
3. 编译并部署，构造函数需要平台钱包地址

### 在 MetaMask 中交互
1. 添加合约地址到 MetaMask
2. 使用合约 ABI 进行交互
3. 调用相应函数创建项目或投资

## ⚠️ 安全注意事项

1. **私钥管理**: 生产环境请使用环境变量管理私钥
2. **权限控制**: 合约部署后及时转移所有权
3. **Gas 优化**: 大批量操作时注意 Gas 消耗
4. **时间依赖**: 注意区块时间戳的精度限制
5. **金额验证**: 部署前仔细检查最小金额设置

## 📈 Gas 估算

| 操作 | 预估 Gas |
|------|---------|
| 部署合约 | ~2,400,000 |
| 创建项目 | ~180,000 |
| 投资项目 | ~100,000 |
| 提取资金 | ~80,000 |
| 申请退款 | ~60,000 |

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个合约！

## 📄 许可证

MIT License

---

🚀 **现在你可以开始使用这个功能完整的众筹智能合约了！** 