# 🎯 众筹智能合约系统

> 基于以太坊的去中心化众筹平台，支持小数金额和秒级时间控制

## ✨ 核心特性

- 🔥 **灵活金额**: 支持小数捐款，最小0.0001 ETH
- ⏰ **精确时间**: 秒级时间控制，最短1小时
- 💰 **安全资金**: 自动退款机制，2.5%平台手续费
- 🛡️ **安全防护**: 重入攻击防护，完整权限控制
- 📊 **完整测试**: 33个测试用例，100%覆盖率

## 🚀 快速开始

### 1. 安装依赖
```bash
cd contracts
npm install
```

### 2. 运行测试
```bash
npm test
```

### 3. 部署合约
```bash
# 部署到私有网络
npx hardhat run scripts/deploy.js --network private

# 部署到本地网络
npx hardhat run scripts/deploy.js --network localhost
```

### 4. 交互式测试
```bash
npx hardhat run scripts/interactive-test.js --network private
```

## 📋 项目结构

```
contracts/
├── contracts/Crowdfunding.sol    # 主合约文件
├── scripts/
│   ├── deploy.js                 # 部署脚本
│   ├── interactive-test.js       # 交互式测试工具
│   └── generate-wallets.js       # 钱包生成工具
├── test/Crowdfunding.test.js     # 测试文件 (33个测试)
├── hardhat.config.js             # Hardhat配置
├── deployment-info.json          # 部署信息(自动生成)
└── docs/                         # 文档目录
```

## ⚙️ 合约参数 (已优化)

| 参数 | 值 | 说明 |
|------|----|----|
| 最小捐款金额 | 0.0001 ETH | 支持小额捐款 |
| 最小筹款目标 | 0.001 ETH | 支持小型项目 |
| 最短持续时间 | 1小时 (3600秒) | 灵活时间控制 |
| 最长持续时间 | 90天 (7776000秒) | 长期项目支持 |
| 平台手续费 | 2.5% | 可调整 (最高10%) |

## 🌐 网络配置

```javascript
// hardhat.config.js
networks: {
  private: {
    url: "http://152.53.165.85:8545",
    chainId: 88,
    accounts: ["0xf78731a1259d779ee98fdd253907c459bf26f750e54056368587882c2b222cf1"],
    gas: 2100000,
    gasPrice: 8000000000
  }
}
```

## 🧪 测试状态

✅ **33/33 测试通过** | 🎯 **100% 覆盖率** | ⚡ **2秒运行时间**

### 测试覆盖
- 合约部署 (4个) ✅
- 项目管理 (6个) ✅
- 投资功能 (6个) ✅
- 资金管理 (6个) ✅
- 查询功能 (3个) ✅
- 管理员功能 (4个) ✅
- 安全防护 (4个) ✅

## 📊 最新部署

**合约地址**: `0x74785B0A9EE496968d01F5B924BA3B9AF9C99b42`
**网络**: private (Chain ID: 88)
**部署时间**: 2025-06-08 09:48:32
**Gas 使用**: 1,980,324

> 详细信息查看 `deployment-info.json`

## 📚 文档导航

| 文档 | 描述 | 链接 |
|------|------|------|
| 🚀 快速开始 | 5分钟快速体验 | [QUICKSTART.md](docs/QUICKSTART.md) |
| 🛠️ 部署指南 | 详细部署步骤 | [DEPLOYMENT.md](docs/DEPLOYMENT.md) |
| 🎮 使用指南 | 交互式工具使用 | [USAGE.md](docs/USAGE.md) |
| 📚 API 文档 | 完整函数参考 | [API.md](docs/API.md) |

## 🎯 核心功能

### 项目管理
- ✅ 创建项目 (支持小数金额和秒级时间)
- ✅ 取消项目 (创建者权限)
- ✅ 查看项目详情和进度

### 投资系统
- ✅ 小额投资 (最小 0.0001 ETH)
- ✅ 实时进度更新
- ✅ 自动达标检测

### 资金管理
- ✅ 安全提取 (2.5% 平台手续费)
- ✅ 全额退款 (项目失败时)
- ✅ 重入攻击防护

### 查询统计
- ✅ 项目统计和成功率
- ✅ 用户投资记录
- ✅ 平台整体数据

## 🔧 技术栈

- **Solidity**: 0.8.20
- **框架**: Hardhat
- **测试**: Chai + Mocha
- **安全**: OpenZeppelin
- **网络**: 私有以太坊 (Chain ID: 88)

## 📞 获取帮助

- 🐛 **问题反馈**: 查看控制台错误信息
- 📖 **详细文档**: 参考 `docs/` 目录
- 🧪 **功能验证**: 运行 `npm test`
- 💬 **技术支持**: 检查 `deployment-info.json`

---

**📄 许可证**: MIT License - 仅供教育学习使用