# 📚 API 参考文档

## 🔧 合约函数

### 📝 项目管理

#### createProject
创建新的众筹项目
```solidity
function createProject(
    string memory _title,
    string memory _description,
    uint256 _goalAmount,
    uint256 _durationInSeconds
) external returns (uint256)
```

**参数:**
- `_title`: 项目标题 (不能为空)
- `_description`: 项目描述 (不能为空)
- `_goalAmount`: 目标金额 (≥ 0.001 ETH)
- `_durationInSeconds`: 持续时间 (3600-7776000秒)

**返回:** 项目ID

**示例:**
```javascript
await crowdfunding.createProject(
    "智能手表",
    "健康监测手表",
    ethers.parseEther("0.01"),
    3600  // 1小时
);
```

#### cancelProject
取消项目 (仅创建者)
```solidity
function cancelProject(uint256 _projectId) external
```

### 💰 投资功能

#### contribute
向项目投资
```solidity
function contribute(uint256 _projectId) external payable
```

**要求:**
- 投资金额 ≥ 0.0001 ETH
- 项目处于活跃状态
- 未超过截止时间

**示例:**
```javascript
await crowdfunding.contribute(1, {
    value: ethers.parseEther("0.005")
});
```

### 💸 资金管理

#### withdrawFunds
提取项目资金 (仅创建者)
```solidity
function withdrawFunds(uint256 _projectId) external
```

**条件:**
- 项目状态为成功
- 资金未被提取过
- 自动扣除2.5%手续费

#### requestRefund
申请退款
```solidity
function requestRefund(uint256 _projectId) external
```

**条件:**
- 项目失败或超时未达标
- 用户有投资记录
- 全额退款

### 📊 查询函数

#### getProject
获取项目详细信息
```solidity
function getProject(uint256 _projectId) external view returns (
    uint256 id,
    string memory title,
    string memory description,
    address creator,
    uint256 goalAmount,
    uint256 currentAmount,
    uint256 deadline,
    uint256 createdAt,
    ProjectStatus status,
    bool withdrawn,
    uint256 contributorsCount
)
```

#### getUserContribution
查询用户投资金额
```solidity
function getUserContribution(uint256 _projectId, address _user) 
    external view returns (uint256)
```

#### getProjectContributors
获取项目投资者列表
```solidity
function getProjectContributors(uint256 _projectId) 
    external view returns (address[] memory)
```

#### getUserCreatedProjects
获取用户创建的项目
```solidity
function getUserCreatedProjects(address _user) 
    external view returns (uint256[] memory)
```

#### getUserParticipatedProjects
获取用户参与的项目
```solidity
function getUserParticipatedProjects(address _user) 
    external view returns (uint256[] memory)
```

#### getTotalProjects
获取项目总数
```solidity
function getTotalProjects() external view returns (uint256)
```

#### getProjectSuccessRate
计算项目成功率
```solidity
function getProjectSuccessRate() external view returns (uint256)
```

### ⚙️ 管理员函数

#### updatePlatformFeeRate
更新平台手续费率 (仅所有者)
```solidity
function updatePlatformFeeRate(uint256 _newRate) external onlyOwner
```

**参数:** `_newRate` - 新费率 (基点，最大1000 = 10%)

#### updatePlatformWallet
更新平台钱包地址 (仅所有者)
```solidity
function updatePlatformWallet(address payable _newWallet) external onlyOwner
```

#### emergencyFailProject
紧急标记项目失败 (仅所有者)
```solidity
function emergencyFailProject(uint256 _projectId) external onlyOwner
```

## 📡 事件

### ProjectCreated
项目创建事件
```solidity
event ProjectCreated(
    uint256 indexed projectId,
    address indexed creator,
    string title,
    uint256 goalAmount,
    uint256 deadline
);
```

### ContributionMade
投资事件
```solidity
event ContributionMade(
    uint256 indexed projectId,
    address indexed contributor,
    uint256 amount,
    uint256 currentTotal
);
```

### ProjectSuccessful
项目成功事件
```solidity
event ProjectSuccessful(
    uint256 indexed projectId,
    uint256 totalAmount
);
```

### ProjectFailed
项目失败事件
```solidity
event ProjectFailed(
    uint256 indexed projectId,
    uint256 totalAmount
);
```

### FundsWithdrawn
资金提取事件
```solidity
event FundsWithdrawn(
    uint256 indexed projectId,
    address indexed creator,
    uint256 amount,
    uint256 platformFee
);
```

### RefundIssued
退款事件
```solidity
event RefundIssued(
    uint256 indexed projectId,
    address indexed contributor,
    uint256 amount
);
```

## 🔍 项目状态

```solidity
enum ProjectStatus {
    Active,     // 0 - 进行中
    Successful, // 1 - 成功
    Failed,     // 2 - 失败
    Withdrawn   // 3 - 已提取
}
```

## 💻 JavaScript 集成

### ethers.js 示例
```javascript
const { ethers } = require('ethers');

// 连接到合约
const provider = new ethers.JsonRpcProvider('http://152.53.165.85:8545');
const signer = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(contractAddress, contractABI, signer);

// 创建项目
const tx = await contract.createProject(
    "项目标题",
    "项目描述",
    ethers.parseEther("0.01"),
    3600
);
await tx.wait();

// 投资项目
const contributeTx = await contract.contribute(1, {
    value: ethers.parseEther("0.005")
});
await contributeTx.wait();

// 查询项目
const project = await contract.getProject(1);
console.log(project);

// 监听事件
contract.on("ProjectCreated", (projectId, creator, title) => {
    console.log(`新项目: ${title} by ${creator}`);
});
```

### Web3.js 示例
```javascript
const Web3 = require('web3');
const web3 = new Web3('http://152.53.165.85:8545');

const contract = new web3.eth.Contract(contractABI, contractAddress);

// 创建项目
await contract.methods.createProject(
    "项目标题",
    "项目描述",
    web3.utils.toWei("0.01", "ether"),
    3600
).send({ from: userAddress });

// 投资项目
await contract.methods.contribute(1).send({
    from: userAddress,
    value: web3.utils.toWei("0.005", "ether")
});
```

## 🚨 错误处理

### 常见错误
- `"Title cannot be empty"` - 项目标题为空
- `"Goal amount too low"` - 目标金额过低
- `"Duration too short"` - 持续时间过短
- `"Contribution amount too low"` - 投资金额过低
- `"Project does not exist"` - 项目不存在
- `"Only project creator can call this"` - 非创建者调用
- `"Project must be successful"` - 项目未成功
- `"Funds already withdrawn"` - 资金已提取
- `"No contribution found"` - 无投资记录
- `"Refund not available"` - 退款不可用

### 错误处理示例
```javascript
try {
    await contract.contribute(1, {
        value: ethers.parseEther("0.005")
    });
} catch (error) {
    if (error.message.includes("Contribution amount too low")) {
        console.log("投资金额过低，最小0.0001 ETH");
    } else if (error.message.includes("Project does not exist")) {
        console.log("项目不存在");
    } else {
        console.log("交易失败:", error.message);
    }
}
```
