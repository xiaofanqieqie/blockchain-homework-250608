# 📚 文档中心

> 众筹智能合约完整文档导航

## 🎯 快速导航

### 🚀 新手入门
- **[快速开始](QUICKSTART.md)** - 5分钟快速体验完整功能
- **[部署指南](DEPLOYMENT.md)** - 详细的部署步骤和配置

### 🛠️ 开发使用
- **[使用指南](USAGE.md)** - 交互式工具使用教程
- **[API 文档](API.md)** - 完整的函数和事件参考

## 📋 文档概览

| 文档 | 内容 | 适合人群 |
|------|------|----------|
| [QUICKSTART.md](QUICKSTART.md) | 5分钟快速体验 | 🔰 初学者 |
| [DEPLOYMENT.md](DEPLOYMENT.md) | 部署步骤和配置 | 🔧 开发者 |
| [USAGE.md](USAGE.md) | 交互工具使用 | 🎮 测试者 |
| [API.md](API.md) | 函数和事件参考 | 💻 集成者 |

## 🎯 按需求选择

### 我想快速体验功能
👉 [快速开始](QUICKSTART.md) - 一键启动，5分钟完整体验

### 我想部署到自己的网络
👉 [部署指南](DEPLOYMENT.md) - 详细步骤，配置说明

### 我想测试合约功能
👉 [使用指南](USAGE.md) - 交互式工具，完整测试流程

### 我想集成到应用中
👉 [API 文档](API.md) - 函数参考，代码示例

## 🔧 技术信息

### 合约特性
- ✅ 支持小数金额 (最小 0.0001 ETH)
- ✅ 秒级时间控制 (最短 1小时)
- ✅ 自动退款机制
- ✅ 重入攻击防护
- ✅ 完整权限控制

### 测试状态
- 🧪 **33/33** 测试通过
- 🎯 **100%** 代码覆盖率
- ⚡ **2秒** 运行时间

### 最新部署
- 📍 **合约地址**: `0x74785B0A9EE496968d01F5B924BA3B9AF9C99b42`
- 🌐 **网络**: private (Chain ID: 88)
- ⛽ **Gas 使用**: 1,980,324

## 🚀 一键命令

```bash
# 完整体验流程
cd contracts
npm install && npm test
npx hardhat run scripts/deploy.js --network private
npx hardhat run scripts/interactive-test.js --network private
```

## 📞 获取帮助

### 常见问题
- **部署失败**: 查看 [部署指南](DEPLOYMENT.md) 故障排除部分
- **功能不清楚**: 参考 [使用指南](USAGE.md) 功能详解
- **集成问题**: 查看 [API 文档](API.md) 代码示例

### 技术支持
- 🐛 查看控制台错误信息
- 📁 检查 `deployment-info.json` 文件
- 🧪 运行 `npm test` 验证功能
- 💬 查看相关文档获取详细说明

---

**💡 提示**: 建议按照 快速开始 → 部署指南 → 使用指南 → API 文档 的顺序阅读
