const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 测试已部署的众筹合约...\n");

  // 读取部署信息
  const fs = require('fs');
  const deploymentInfo = JSON.parse(fs.readFileSync('deployment-info.json', 'utf8'));
  
  console.log("📍 合约地址:", deploymentInfo.contractAddress);
  
  // 获取合约实例
  const Crowdfunding = await ethers.getContractFactory("Crowdfunding");
  const crowdfunding = Crowdfunding.attach(deploymentInfo.contractAddress);
  
  // 获取账户
  const signers = await ethers.getSigners();
  const owner = signers[0];
  const creator = signers.length > 1 ? signers[1] : signers[0];
  console.log("👤 测试账户:", creator.address);
  
  // 测试基本功能
  console.log("🔍 验证合约基本信息...");
  const totalProjects = await crowdfunding.getTotalProjects();
  console.log("📊 当前项目总数:", totalProjects.toString());
  
  const platformFeeRate = await crowdfunding.platformFeeRate();
  console.log("💸 平台手续费率:", platformFeeRate.toString() / 100, "%");
  
  const contractOwner = await crowdfunding.owner();
  console.log("👑 合约所有者:", contractOwner);
  
  // 测试创建项目
  console.log("\n🚀 测试创建项目...");
  const tx = await crowdfunding.connect(creator).createProject(
    "测试众筹项目",
    "这是一个用于测试的众筹项目",
    ethers.parseEther("1.0"),
    30 // 30天
  );
  
  await tx.wait();
  console.log("✅ 项目创建成功！");
  
  // 验证项目信息
  const projectInfo = await crowdfunding.getProject(1);
  console.log("📋 项目信息:");
  console.log("  - ID:", projectInfo.id.toString());
  console.log("  - 标题:", projectInfo.title);
  console.log("  - 创建者:", projectInfo.creator);
  console.log("  - 目标金额:", ethers.formatEther(projectInfo.goalAmount), "ETH");
  console.log("  - 当前金额:", ethers.formatEther(projectInfo.currentAmount), "ETH");
  console.log("  - 状态:", projectInfo.status.toString());
  
  const newTotalProjects = await crowdfunding.getTotalProjects();
  console.log("📊 更新后项目总数:", newTotalProjects.toString());
  
  console.log("\n🎉 合约测试完成！所有功能正常运行。");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ 测试失败:", error);
    process.exit(1);
  }); 