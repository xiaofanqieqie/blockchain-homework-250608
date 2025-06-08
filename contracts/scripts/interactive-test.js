const { ethers } = require("hardhat");
const readline = require('readline');
const fs = require('fs');

// 创建命令行接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 合约相关变量
let crowdfunding;
let deployer;
let contractAddress;

// 项目状态枚举
const ProjectStatus = {
  0: "活跃中",
  1: "成功",
  2: "失败", 
  3: "已提取"
};

// 工具函数：询问用户输入
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// 工具函数：格式化以太币金额
function formatEther(wei) {
  return ethers.formatEther(wei);
}

// 工具函数：解析以太币金额
function parseEther(ether) {
  return ethers.parseEther(ether);
}

// 工具函数：格式化时间戳
function formatTimestamp(timestamp) {
  return new Date(Number(timestamp) * 1000).toLocaleString('zh-CN');
}

// 初始化合约连接
async function initContract() {
  console.log("🔗 正在连接到已部署的众筹合约...\n");
  
  try {
    // 读取部署信息
    if (fs.existsSync('deployment-info.json')) {
      const deploymentInfo = JSON.parse(fs.readFileSync('deployment-info.json', 'utf8'));
      contractAddress = deploymentInfo.contractAddress;
      console.log("📍 合约地址:", contractAddress);
    } else {
      throw new Error("未找到部署信息文件 deployment-info.json");
    }

    // 获取签名者 - 确保使用私有网络账户
    [deployer] = await ethers.getSigners();
    console.log("👤 当前账户:", deployer.address);
    
    // 验证账户地址
    const expectedAddress = "0x1184a8E4007f05c34e8610fdE3d741F1BEDeBace";
    if (deployer.address.toLowerCase() !== expectedAddress.toLowerCase()) {
      console.log("⚠️  当前账户与私有网络主账户不匹配");
      console.log("期望账户:", expectedAddress);
      console.log("当前账户:", deployer.address);
    }
    
    // 检查余额
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("💰 账户余额:", formatEther(balance), "ETH");

    // 检查网络连接
    const network = await ethers.provider.getNetwork();
    console.log("🌐 网络信息:");
    console.log("   链ID:", network.chainId.toString());
    console.log("   网络名:", network.name);

    if (network.chainId !== 88n) {
      throw new Error(`网络链ID不匹配，期望88，实际${network.chainId}`);
    }

    // 连接到已部署的合约
    const Crowdfunding = await ethers.getContractFactory("Crowdfunding");
    crowdfunding = Crowdfunding.attach(contractAddress);
    
    // 验证合约连接 - 使用更安全的方法
    console.log("🔍 验证合约连接...");
    
    try {
      // 先检查合约代码是否存在
      const code = await ethers.provider.getCode(contractAddress);
      if (code === '0x') {
        throw new Error("合约地址处没有部署代码");
      }
      
      // 尝试调用一个简单的查询函数
      const totalProjects = await crowdfunding.getTotalProjects();
      console.log("📊 当前项目总数:", totalProjects.toString());
      
      // 尝试获取平台信息
      const platformFeeRate = await crowdfunding.platformFeeRate();
      console.log("💸 平台手续费率:", (Number(platformFeeRate) / 100).toFixed(2), "%");
      
    } catch (error) {
      console.error("⚠️  合约调用失败:", error.message);
      
      // 尝试重新部署或提供诊断信息
      console.log("\n🔧 诊断信息:");
      console.log("合约地址:", contractAddress);
      console.log("网络RPC:", "http://152.53.165.85:8545");
      console.log("建议: 请确保合约已正确部署且网络连接正常");
      
      const continueAnyway = await askQuestion("\n是否继续尝试使用工具? (y/n): ");
      if (continueAnyway.toLowerCase() !== 'y') {
        return false;
      }
    }
    
    console.log("✅ 合约连接成功!\n");
    return true;
  } catch (error) {
    console.error("❌ 合约连接失败:", error.message);
    
    // 提供详细的错误诊断
    console.log("\n🔧 错误诊断:");
    console.log("1. 检查区块链网络是否运行:");
    console.log("   curl -X POST -H 'Content-Type: application/json' \\");
    console.log("     --data '{\"jsonrpc\":\"2.0\",\"method\":\"net_version\",\"params\":[],\"id\":1}' \\");
    console.log("     http://152.53.165.85:8545");
    console.log("\n2. 检查挖矿状态:");
    console.log("   在Geth控制台运行: miner.start(1)");
    console.log("\n3. 检查账户余额:");
    console.log("   eth.getBalance(eth.accounts[0])");
    
    return false;
  }
}

// 显示主菜单
function showMainMenu() {
  console.log("\n" + "=".repeat(50));
  console.log("🎯 众筹合约交互式测试工具");
  console.log("=".repeat(50));
  console.log("1.  📝 创建新项目");
  console.log("2.  💰 向项目投资");
  console.log("3.  💸 提取项目资金");
  console.log("4.  🔄 申请退款");
  console.log("5.  ❌ 取消项目");
  console.log("6.  📋 查看项目详情");
  console.log("7.  👥 查看项目投资者");
  console.log("8.  🔍 查看用户投资记录");
  console.log("9.  📊 查看用户创建的项目");
  console.log("10. 📈 查看用户参与的项目");
  console.log("11. 📉 查看平台统计信息");
  console.log("12. ⚙️  管理员功能");
  console.log("13. 💳 查看账户信息");
  console.log("14. 🔧 网络诊断");
  console.log("0.  🚪 退出程序");
  console.log("=".repeat(50));
}

// 14. 网络诊断功能
async function networkDiagnostics() {
  console.log("\n🔧 网络诊断");
  console.log("-".repeat(30));
  
  try {
    console.log("正在进行网络诊断...\n");
    
    // 1. 检查网络连接
    console.log("1. 📡 网络连接检查:");
    const network = await ethers.provider.getNetwork();
    console.log("   ✅ 网络连接正常");
    console.log("   链ID:", network.chainId.toString());
    console.log("   网络名:", network.name);
    
    // 2. 检查账户状态
    console.log("\n2. 👤 账户状态检查:");
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("   账户地址:", deployer.address);
    console.log("   账户余额:", formatEther(balance), "ETH");
    
    // 3. 检查区块链状态
    console.log("\n3. ⛓️ 区块链状态:");
    const blockNumber = await ethers.provider.getBlockNumber();
    console.log("   当前区块高度:", blockNumber);
    
    const latestBlock = await ethers.provider.getBlock(blockNumber);
    console.log("   最新区块时间:", new Date(latestBlock.timestamp * 1000).toLocaleString('zh-CN'));
    
    // 4. 检查合约状态
    console.log("\n4. 📄 合约状态检查:");
    if (contractAddress) {
      const code = await ethers.provider.getCode(contractAddress);
      if (code === '0x') {
        console.log("   ❌ 合约地址处没有代码");
      } else {
        console.log("   ✅ 合约代码存在");
        console.log("   合约地址:", contractAddress);
        
        try {
          const totalProjects = await crowdfunding.getTotalProjects();
          console.log("   项目总数:", totalProjects.toString());
          console.log("   ✅ 合约功能正常");
        } catch (error) {
          console.log("   ❌ 合约调用失败:", error.message);
        }
      }
    } else {
      console.log("   ❌ 未找到合约地址");
    }
    
    // 5. 给出建议
    console.log("\n5. 💡 建议:");
    if (balance < parseEther("0.1")) {
      console.log("   ⚠️  账户余额较低，建议充值");
    }
    
    console.log("   - 确保Geth节点正在运行");
    console.log("   - 确保挖矿已启动: miner.start(1)");
    console.log("   - 检查防火墙设置是否允许8545端口");
    
  } catch (error) {
    console.error("❌ 网络诊断失败:", error.message);
  }
}

// 1. 创建新项目
async function createProject() {
  console.log("\n📝 创建新项目");
  console.log("-".repeat(30));
  
  try {
    const title = await askQuestion("请输入项目标题: ");
    const description = await askQuestion("请输入项目描述: ");
    const goalAmount = await askQuestion("请输入目标金额 (ETH): ");
    const duration = await askQuestion("请输入众筹天数 (1-90): ");

    console.log("\n确认信息:");
    console.log("标题:", title);
    console.log("描述:", description);
    console.log("目标金额:", goalAmount, "ETH");
    console.log("持续时间:", duration, "天");

    const confirm = await askQuestion("\n确认创建项目? (y/n): ");
    if (confirm.toLowerCase() !== 'y') {
      console.log("❌ 取消创建");
      return;
    }

    console.log("⏳ 正在创建项目...");
    
    // 估算Gas费用
    const estimatedGas = await crowdfunding.createProject.estimateGas(
      title,
      description,
      parseEther(goalAmount),
      parseInt(duration)
    );
    console.log("📊 预估Gas费用:", estimatedGas.toString());
    
    const tx = await crowdfunding.createProject(
      title,
      description,
      parseEther(goalAmount),
      parseInt(duration),
      {
        gasLimit: estimatedGas * 12n / 10n // 增加20%的gas余量
      }
    );
    
    console.log("🔄 交易哈希:", tx.hash);
    console.log("⏳ 等待交易确认...");
    
    const receipt = await tx.wait();
    console.log("✅ 交易已确认! Gas使用量:", receipt.gasUsed.toString());
    
    // 从事件中获取项目ID
    const event = receipt.logs.find(log => {
      try {
        const parsed = crowdfunding.interface.parseLog(log);
        return parsed.name === 'ProjectCreated';
      } catch {
        return false;
      }
    });
    
    if (event) {
      const parsedEvent = crowdfunding.interface.parseLog(event);
      const projectId = parsedEvent.args.projectId;
      console.log("✅ 项目创建成功!");
      console.log("🆔 项目ID:", projectId.toString());
    }
    
  } catch (error) {
    console.error("❌ 创建项目失败:", error.message);
    
    // 提供具体的错误诊断
    if (error.message.includes("insufficient funds")) {
      console.log("💡 解决方案: 账户余额不足，请充值ETH");
    } else if (error.message.includes("gas")) {
      console.log("💡 解决方案: Gas费用不足，请增加Gas Limit");
    } else if (error.message.includes("revert")) {
      console.log("💡 解决方案: 交易被回滚，请检查输入参数");
    }
  }
}

// 2. 向项目投资
async function contributeToProject() {
  console.log("\n💰 向项目投资");
  console.log("-".repeat(30));
  
  try {
    const projectId = await askQuestion("请输入项目ID: ");
    const amount = await askQuestion("请输入投资金额 (ETH): ");

    // 先查看项目信息
    console.log("⏳ 正在获取项目信息...");
    const project = await crowdfunding.getProject(parseInt(projectId));
    console.log("\n项目信息:");
    console.log("标题:", project.title);
    console.log("目标金额:", formatEther(project.goalAmount), "ETH");
    console.log("当前金额:", formatEther(project.currentAmount), "ETH");
    console.log("状态:", ProjectStatus[project.status]);

    // 检查项目状态
    if (project.status !== 0) {
      console.log("❌ 该项目不是活跃状态，无法投资");
      return;
    }

    const confirm = await askQuestion(`\n确认投资 ${amount} ETH 到项目 ${projectId}? (y/n): `);
    if (confirm.toLowerCase() !== 'y') {
      console.log("❌ 取消投资");
      return;
    }

    console.log("⏳ 正在投资...");
    const tx = await crowdfunding.contribute(parseInt(projectId), {
      value: parseEther(amount)
    });
    
    console.log("🔄 交易哈希:", tx.hash);
    console.log("⏳ 等待交易确认...");
    
    const receipt = await tx.wait();
    console.log("✅ 投资成功! Gas使用量:", receipt.gasUsed.toString());
    
    // 显示更新后的项目信息
    const updatedProject = await crowdfunding.getProject(parseInt(projectId));
    console.log("💰 项目当前总额:", formatEther(updatedProject.currentAmount), "ETH");
    console.log("📊 完成度:", (Number(updatedProject.currentAmount) * 100 / Number(updatedProject.goalAmount)).toFixed(2), "%");
    
    if (updatedProject.status === 1) {
      console.log("🎉 恭喜！项目已达到目标金额！");
    }
    
  } catch (error) {
    console.error("❌ 投资失败:", error.message);
  }
}

// 3. 提取项目资金
async function withdrawFunds() {
  console.log("\n💸 提取项目资金");
  console.log("-".repeat(30));
  
  try {
    const projectId = await askQuestion("请输入项目ID: ");

    // 查看项目信息
    const project = await crowdfunding.getProject(parseInt(projectId));
    console.log("\n项目信息:");
    console.log("标题:", project.title);
    console.log("创建者:", project.creator);
    console.log("当前金额:", formatEther(project.currentAmount), "ETH");
    console.log("状态:", ProjectStatus[project.status]);
    console.log("是否已提取:", project.withdrawn ? "是" : "否");

    if (project.creator.toLowerCase() !== deployer.address.toLowerCase()) {
      console.log("❌ 只有项目创建者才能提取资金");
      return;
    }

    if (project.status !== 1) { // 1 = Successful
      console.log("❌ 项目必须成功才能提取资金");
      return;
    }

    const platformFee = Number(project.currentAmount) * 250 / 10000; // 2.5%
    const creatorAmount = Number(project.currentAmount) - platformFee;
    
    console.log("💸 平台手续费 (2.5%):", formatEther(platformFee.toString()), "ETH");
    console.log("💰 创建者将获得:", formatEther(creatorAmount.toString()), "ETH");

    const confirm = await askQuestion("\n确认提取资金? (y/n): ");
    if (confirm.toLowerCase() !== 'y') {
      console.log("❌ 取消提取");
      return;
    }

    console.log("⏳ 正在提取资金...");
    const tx = await crowdfunding.withdrawFunds(parseInt(projectId));
    
    console.log("🔄 交易哈希:", tx.hash);
    console.log("⏳ 等待交易确认...");
    
    await tx.wait();
    console.log("✅ 资金提取成功!");
    
  } catch (error) {
    console.error("❌ 提取资金失败:", error.message);
  }
}

// 4. 申请退款
async function requestRefund() {
  console.log("\n🔄 申请退款");
  console.log("-".repeat(30));
  
  try {
    const projectId = await askQuestion("请输入项目ID: ");

    // 查看项目和用户投资信息
    const project = await crowdfunding.getProject(parseInt(projectId));
    const userContribution = await crowdfunding.getUserContribution(parseInt(projectId), deployer.address);
    
    console.log("\n项目信息:");
    console.log("标题:", project.title);
    console.log("状态:", ProjectStatus[project.status]);
    console.log("截止时间:", formatTimestamp(project.deadline));
    console.log("您的投资:", formatEther(userContribution), "ETH");

    if (userContribution === 0n) {
      console.log("❌ 您没有在该项目中投资");
      return;
    }

    const now = Math.floor(Date.now() / 1000);
    const canRefund = project.status === 2 || // Failed
                     (now >= project.deadline && project.currentAmount < project.goalAmount);
    
    if (!canRefund) {
      console.log("❌ 不满足退款条件");
      console.log("退款条件: 项目失败或超过截止日期且未达到目标");
      return;
    }

    const confirm = await askQuestion(`\n确认申请退款 ${formatEther(userContribution)} ETH? (y/n): `);
    if (confirm.toLowerCase() !== 'y') {
      console.log("❌ 取消退款");
      return;
    }

    console.log("⏳ 正在申请退款...");
    const tx = await crowdfunding.requestRefund(parseInt(projectId));
    
    console.log("🔄 交易哈希:", tx.hash);
    console.log("⏳ 等待交易确认...");
    
    await tx.wait();
    console.log("✅ 退款成功!");
    
  } catch (error) {
    console.error("❌ 退款失败:", error.message);
  }
}

// 5. 取消项目
async function cancelProject() {
  console.log("\n❌ 取消项目");
  console.log("-".repeat(30));
  
  try {
    const projectId = await askQuestion("请输入项目ID: ");

    // 查看项目信息
    const project = await crowdfunding.getProject(parseInt(projectId));
    console.log("\n项目信息:");
    console.log("标题:", project.title);
    console.log("创建者:", project.creator);
    console.log("当前金额:", formatEther(project.currentAmount), "ETH");
    console.log("状态:", ProjectStatus[project.status]);

    if (project.creator.toLowerCase() !== deployer.address.toLowerCase()) {
      console.log("❌ 只有项目创建者才能取消项目");
      return;
    }

    if (project.status !== 0) { // 0 = Active
      console.log("❌ 只能取消活跃状态的项目");
      return;
    }

    const confirm = await askQuestion("\n确认取消项目? (y/n): ");
    if (confirm.toLowerCase() !== 'y') {
      console.log("❌ 取消操作");
      return;
    }

    console.log("⏳ 正在取消项目...");
    const tx = await crowdfunding.cancelProject(parseInt(projectId));
    
    console.log("🔄 交易哈希:", tx.hash);
    console.log("⏳ 等待交易确认...");
    
    await tx.wait();
    console.log("✅ 项目取消成功!");
    
  } catch (error) {
    console.error("❌ 取消项目失败:", error.message);
  }
}

// 6. 查看项目详情
async function viewProjectDetails() {
  console.log("\n📋 查看项目详情");
  console.log("-".repeat(30));
  
  try {
    const projectId = await askQuestion("请输入项目ID (留空查看所有项目): ");

    if (projectId === '') {
      // 显示所有项目概览
      const totalProjects = await crowdfunding.getTotalProjects();
      console.log("\n📊 项目总数:", totalProjects.toString());
      
      if (totalProjects === 0n) {
        console.log("暂无项目，请先创建项目");
        return;
      }
      
      for (let i = 1; i <= totalProjects; i++) {
        try {
          const project = await crowdfunding.getProject(i);
          const progress = project.goalAmount > 0 ? 
            (Number(project.currentAmount) * 100 / Number(project.goalAmount)) : 0;
          
          console.log(`\n[${i}] ${project.title}`);
          console.log(`    状态: ${ProjectStatus[project.status]}`);
          console.log(`    进度: ${formatEther(project.currentAmount)}/${formatEther(project.goalAmount)} ETH (${progress.toFixed(1)}%)`);
          console.log(`    截止: ${formatTimestamp(project.deadline)}`);
        } catch (e) {
          console.log(`[${i}] 项目信息获取失败:`, e.message);
        }
      }
    } else {
      // 显示单个项目详情
      const project = await crowdfunding.getProject(parseInt(projectId));
      
      console.log("\n📋 项目详细信息:");
      console.log("=".repeat(40));
      console.log("🆔 ID:", project.id.toString());
      console.log("📝 标题:", project.title);
      console.log("📄 描述:", project.description);
      console.log("👤 创建者:", project.creator);
      console.log("🎯 目标金额:", formatEther(project.goalAmount), "ETH");
      console.log("💰 当前金额:", formatEther(project.currentAmount), "ETH");
      console.log("📊 完成度:", (Number(project.currentAmount) * 100 / Number(project.goalAmount)).toFixed(2), "%");
      console.log("📅 创建时间:", formatTimestamp(project.createdAt));
      console.log("⏰ 截止时间:", formatTimestamp(project.deadline));
      console.log("📈 状态:", ProjectStatus[project.status]);
      console.log("💸 已提取:", project.withdrawn ? "是" : "否");
      console.log("👥 投资者数量:", project.contributorsCount.toString());
      
      // 计算剩余时间
      const now = Math.floor(Date.now() / 1000);
      const remaining = Number(project.deadline) - now;
      if (remaining > 0) {
        const days = Math.floor(remaining / 86400);
        const hours = Math.floor((remaining % 86400) / 3600);
        console.log("⏳ 剩余时间:", `${days}天${hours}小时`);
      } else {
        console.log("⏳ 剩余时间: 已截止");
      }
    }
    
  } catch (error) {
    console.error("❌ 查看项目失败:", error.message);
  }
}

// 7. 查看项目投资者
async function viewProjectContributors() {
  console.log("\n👥 查看项目投资者");
  console.log("-".repeat(30));
  
  try {
    const projectId = await askQuestion("请输入项目ID: ");
    
    const project = await crowdfunding.getProject(parseInt(projectId));
    const contributors = await crowdfunding.getProjectContributors(parseInt(projectId));
    
    console.log(`\n📋 项目 "${project.title}" 的投资者:`);
    console.log("=".repeat(50));
    console.log("投资者总数:", contributors.length);
    
    for (let i = 0; i < contributors.length; i++) {
      const contributor = contributors[i];
      const contribution = await crowdfunding.getUserContribution(parseInt(projectId), contributor);
      console.log(`${i + 1}. ${contributor}`);
      console.log(`   投资金额: ${formatEther(contribution)} ETH`);
    }
    
  } catch (error) {
    console.error("❌ 查看投资者失败:", error.message);
  }
}

// 8. 查看用户投资记录
async function viewUserContributions() {
  console.log("\n🔍 查看用户投资记录");
  console.log("-".repeat(30));
  
  try {
    let userAddress = await askQuestion("请输入用户地址 (留空查看当前账户): ");
    
    if (userAddress === '') {
      userAddress = deployer.address;
    }
    
    console.log("👤 查看用户:", userAddress);
    
    const participatedProjects = await crowdfunding.getUserParticipatedProjects(userAddress);
    
    console.log("\n📊 投资统计:");
    console.log("参与项目数:", participatedProjects.length);
    
    let totalInvested = 0n;
    
    for (let i = 0; i < participatedProjects.length; i++) {
      const projectId = participatedProjects[i];
      const project = await crowdfunding.getProject(Number(projectId));
      const contribution = await crowdfunding.getUserContribution(Number(projectId), userAddress);
      
      totalInvested += contribution;
      
      console.log(`\n[${projectId}] ${project.title}`);
      console.log(`    投资金额: ${formatEther(contribution)} ETH`);
      console.log(`    项目状态: ${ProjectStatus[project.status]}`);
    }
    
    console.log("\n💰 总投资金额:", formatEther(totalInvested), "ETH");
    
  } catch (error) {
    console.error("❌ 查看投资记录失败:", error.message);
  }
}

// 9. 查看用户创建的项目
async function viewUserCreatedProjects() {
  console.log("\n📊 查看用户创建的项目");
  console.log("-".repeat(30));
  
  try {
    let userAddress = await askQuestion("请输入用户地址 (留空查看当前账户): ");
    
    if (userAddress === '') {
      userAddress = deployer.address;
    }
    
    console.log("👤 查看用户:", userAddress);
    
    const createdProjects = await crowdfunding.getUserCreatedProjects(userAddress);
    
    console.log("\n📊 创建统计:");
    console.log("创建项目数:", createdProjects.length);
    
    let totalRaised = 0n;
    let successfulCount = 0;
    
    for (let i = 0; i < createdProjects.length; i++) {
      const projectId = createdProjects[i];
      const project = await crowdfunding.getProject(Number(projectId));
      
      totalRaised += project.currentAmount;
      if (project.status === 1 || project.status === 3) { // Successful or Withdrawn
        successfulCount++;
      }
      
      const progress = Number(project.currentAmount) * 100 / Number(project.goalAmount);
      
      console.log(`\n[${projectId}] ${project.title}`);
      console.log(`    目标: ${formatEther(project.goalAmount)} ETH`);
      console.log(`    筹集: ${formatEther(project.currentAmount)} ETH (${progress.toFixed(1)}%)`);
      console.log(`    状态: ${ProjectStatus[project.status]}`);
      console.log(`    投资者: ${project.contributorsCount} 人`);
    }
    
    console.log("\n📈 汇总信息:");
    console.log("总筹集金额:", formatEther(totalRaised), "ETH");
    console.log("成功项目数:", successfulCount);
    if (createdProjects.length > 0) {
      console.log("成功率:", (successfulCount * 100 / createdProjects.length).toFixed(1), "%");
    }
    
  } catch (error) {
    console.error("❌ 查看创建项目失败:", error.message);
  }
}

// 10. 查看用户参与的项目
async function viewUserParticipatedProjects() {
  console.log("\n📈 查看用户参与的项目");
  console.log("-".repeat(30));
  
  try {
    let userAddress = await askQuestion("请输入用户地址 (留空查看当前账户): ");
    
    if (userAddress === '') {
      userAddress = deployer.address;
    }
    
    await viewUserContributions(); // 复用投资记录查看功能
    
  } catch (error) {
    console.error("❌ 查看参与项目失败:", error.message);
  }
}

// 11. 查看平台统计信息
async function viewPlatformStats() {
  console.log("\n📉 查看平台统计信息");
  console.log("-".repeat(30));
  
  try {
    const totalProjects = await crowdfunding.getTotalProjects();
    const successRate = await crowdfunding.getProjectSuccessRate();
    const platformFeeRate = await crowdfunding.platformFeeRate();
    const platformWallet = await crowdfunding.platformWallet();
    
    console.log("\n📊 平台统计:");
    console.log("=".repeat(40));
    console.log("📈 项目总数:", totalProjects.toString());
    console.log("🎯 成功率:", successRate.toString(), "%");
    console.log("💸 平台手续费:", (Number(platformFeeRate) / 100).toFixed(2), "%");
    console.log("🏦 平台钱包:", platformWallet);
    
    // 计算各状态项目数量
    let activeCount = 0;
    let successfulCount = 0;
    let failedCount = 0;
    let withdrawnCount = 0;
    let totalFundsRaised = 0n;
    
    for (let i = 1; i <= totalProjects; i++) {
      try {
        const project = await crowdfunding.getProject(i);
        totalFundsRaised += project.currentAmount;
        
        switch (project.status) {
          case 0: activeCount++; break;
          case 1: successfulCount++; break; 
          case 2: failedCount++; break;
          case 3: withdrawnCount++; break;
        }
      } catch (e) {
        // 忽略错误，继续下一个项目
      }
    }
    
    console.log("\n📋 项目状态分布:");
    console.log("🟢 活跃项目:", activeCount);
    console.log("✅ 成功项目:", successfulCount);
    console.log("❌ 失败项目:", failedCount);
    console.log("💰 已提取项目:", withdrawnCount);
    
    console.log("\n💰 资金统计:");
    console.log("总筹集金额:", formatEther(totalFundsRaised), "ETH");
    
  } catch (error) {
    console.error("❌ 查看平台统计失败:", error.message);
  }
}

// 12. 管理员功能
async function adminFunctions() {
  console.log("\n⚙️ 管理员功能");
  console.log("-".repeat(30));
  
  try {
    const owner = await crowdfunding.owner();
    console.log("合约所有者:", owner);
    console.log("当前账户:", deployer.address);
    
    if (owner.toLowerCase() !== deployer.address.toLowerCase()) {
      console.log("❌ 您不是合约所有者，无法使用管理员功能");
      return;
    }
    
    console.log("\n管理员功能菜单:");
    console.log("1. 更新平台手续费率");
    console.log("2. 更新平台钱包地址");
    console.log("3. 紧急标记项目为失败");
    console.log("0. 返回主菜单");
    
    const choice = await askQuestion("\n请选择功能: ");
    
    switch (choice) {
      case '1':
        await updatePlatformFeeRate();
        break;
      case '2':
        await updatePlatformWallet();
        break;
      case '3':
        await emergencyFailProject();
        break;
      case '0':
        return;
      default:
        console.log("❌ 无效选择");
    }
    
  } catch (error) {
    console.error("❌ 管理员功能错误:", error.message);
  }
}

// 更新平台手续费率
async function updatePlatformFeeRate() {
  try {
    const currentRate = await crowdfunding.platformFeeRate();
    console.log("当前手续费率:", (Number(currentRate) / 100).toFixed(2), "%");
    
    const newRate = await askQuestion("请输入新的手续费率 (基点，100=1%，最大1000=10%): ");
    const rateNumber = parseInt(newRate);
    
    if (rateNumber < 0 || rateNumber > 1000) {
      console.log("❌ 手续费率必须在 0-1000 之间");
      return;
    }
    
    const confirm = await askQuestion(`确认将手续费率设置为 ${(rateNumber / 100).toFixed(2)}%? (y/n): `);
    if (confirm.toLowerCase() !== 'y') {
      console.log("❌ 取消操作");
      return;
    }
    
    console.log("⏳ 正在更新手续费率...");
    const tx = await crowdfunding.updatePlatformFeeRate(rateNumber);
    await tx.wait();
    console.log("✅ 手续费率更新成功!");
    
  } catch (error) {
    console.error("❌ 更新手续费率失败:", error.message);
  }
}

// 更新平台钱包地址
async function updatePlatformWallet() {
  try {
    const currentWallet = await crowdfunding.platformWallet();
    console.log("当前平台钱包:", currentWallet);
    
    const newWallet = await askQuestion("请输入新的平台钱包地址: ");
    
    if (!ethers.isAddress(newWallet)) {
      console.log("❌ 无效的以太坊地址");
      return;
    }
    
    const confirm = await askQuestion(`确认将平台钱包设置为 ${newWallet}? (y/n): `);
    if (confirm.toLowerCase() !== 'y') {
      console.log("❌ 取消操作");
      return;
    }
    
    console.log("⏳ 正在更新平台钱包...");
    const tx = await crowdfunding.updatePlatformWallet(newWallet);
    await tx.wait();
    console.log("✅ 平台钱包更新成功!");
    
  } catch (error) {
    console.error("❌ 更新平台钱包失败:", error.message);
  }
}

// 紧急标记项目为失败
async function emergencyFailProject() {
  try {
    const projectId = await askQuestion("请输入要标记为失败的项目ID: ");
    
    const project = await crowdfunding.getProject(parseInt(projectId));
    console.log("\n项目信息:");
    console.log("标题:", project.title);
    console.log("状态:", ProjectStatus[project.status]);
    console.log("当前金额:", formatEther(project.currentAmount), "ETH");
    
    if (project.status !== 0) {
      console.log("❌ 只能标记活跃状态的项目为失败");
      return;
    }
    
    const confirm = await askQuestion("⚠️  确认紧急标记该项目为失败? 这将允许投资者申请退款 (y/n): ");
    if (confirm.toLowerCase() !== 'y') {
      console.log("❌ 取消操作");
      return;
    }
    
    console.log("⏳ 正在标记项目为失败...");
    const tx = await crowdfunding.emergencyFailProject(parseInt(projectId));
    await tx.wait();
    console.log("✅ 项目已紧急标记为失败!");
    
  } catch (error) {
    console.error("❌ 紧急操作失败:", error.message);
  }
}

// 13. 查看账户信息
async function viewAccountInfo() {
  console.log("\n💳 查看账户信息");
  console.log("-".repeat(30));
  
  try {
    console.log("👤 当前账户:", deployer.address);
    
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("💰 账户余额:", formatEther(balance), "ETH");
    
    const network = await ethers.provider.getNetwork();
    console.log("🌐 网络信息:");
    console.log("   链ID:", network.chainId.toString());
    console.log("   网络名:", network.name);
    
    const blockNumber = await ethers.provider.getBlockNumber();
    console.log("📦 当前区块:", blockNumber);
    
    // 查看用户在平台的活动概览
    const createdProjects = await crowdfunding.getUserCreatedProjects(deployer.address);
    const participatedProjects = await crowdfunding.getUserParticipatedProjects(deployer.address);
    
    console.log("\n📊 平台活动概览:");
    console.log("创建项目数:", createdProjects.length);
    console.log("参与项目数:", participatedProjects.length);
    
  } catch (error) {
    console.error("❌ 查看账户信息失败:", error.message);
  }
}

// 主程序循环
async function mainLoop() {
  while (true) {
    showMainMenu();
    const choice = await askQuestion("\n请选择功能 (0-14): ");
    
    switch (choice) {
      case '1':
        await createProject();
        break;
      case '2':
        await contributeToProject();
        break;
      case '3':
        await withdrawFunds();
        break;
      case '4':
        await requestRefund();
        break;
      case '5':
        await cancelProject();
        break;
      case '6':
        await viewProjectDetails();
        break;
      case '7':
        await viewProjectContributors();
        break;
      case '8':
        await viewUserContributions();
        break;
      case '9':
        await viewUserCreatedProjects();
        break;
      case '10':
        await viewUserParticipatedProjects();
        break;
      case '11':
        await viewPlatformStats();
        break;
      case '12':
        await adminFunctions();
        break;
      case '13':
        await viewAccountInfo();
        break;
      case '14':
        await networkDiagnostics();
        break;
      case '0':
        console.log("\n👋 感谢使用众筹合约交互式测试工具!");
        rl.close();
        process.exit(0);
        break;
      default:
        console.log("❌ 功能开发中或无效选择，目前可用: 1,2,3,4,5,6,7,8,9,10,11,12,13,14,0");
    }
    
    // 在每个操作后暂停，让用户查看结果
    if (choice !== '0') {
      await askQuestion("\n按回车键继续...");
    }
  }
}

// 程序入口
async function main() {
  console.log("🎯 众筹智能合约交互式测试工具");
  console.log("===================================");
  
  const success = await initContract();
  if (!success) {
    console.log("程序退出");
    rl.close();
    process.exit(1);
  }
  
  await mainLoop();
}

// 处理程序退出
process.on('SIGINT', () => {
  console.log('\n\n👋 程序被中断，正在退出...');
  rl.close();
  process.exit(0);
});

// 启动程序
main().catch(error => {
  console.error("❌ 程序运行错误:", error);
  rl.close();
  process.exit(1);
}); 