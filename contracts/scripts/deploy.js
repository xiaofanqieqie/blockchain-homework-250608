const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 开始部署众筹智能合约...\n");

  // 获取部署账户
  const [deployer] = await ethers.getSigners();
  console.log("📝 部署账户:", deployer.address);
  
  // 检查账户余额
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 账户余额:", ethers.formatEther(balance), "ETH\n");

  // 设置平台钱包地址（可以设置为部署者地址或指定地址）
  const platformWallet = deployer.address; // 或者使用其他地址
  console.log("🏦 平台钱包地址:", platformWallet);

  // 获取合约工厂
  const Crowdfunding = await ethers.getContractFactory("Crowdfunding");
  
  console.log("📦 部署中...");
  
  // 部署合约
  const crowdfunding = await Crowdfunding.deploy(platformWallet);
  
  // 等待部署完成
  await crowdfunding.waitForDeployment();
  
  console.log("✅ 众筹合约部署成功!");
  console.log("📍 合约地址:", await crowdfunding.getAddress());
  console.log("🔗 交易哈希:", crowdfunding.deploymentTransaction().hash);
  console.log("⛽ Gas 使用量:", crowdfunding.deploymentTransaction().gasLimit.toString());

  // 验证部署
  console.log("\n🔍 验证部署...");
  const totalProjects = await crowdfunding.getTotalProjects();
  console.log("📊 当前项目总数:", totalProjects.toString());
  
  const platformFeeRate = await crowdfunding.platformFeeRate();
  console.log("💸 平台手续费率:", platformFeeRate.toString() / 100, "%");

  console.log("\n🎉 部署完成!");
  console.log("\n📋 合约信息汇总:");
  console.log("==========================================");
  console.log("合约名称: Crowdfunding");
  console.log("合约地址:", await crowdfunding.getAddress());
  console.log("网络:", (await deployer.provider.getNetwork()).name);
  console.log("部署者:", deployer.address);
  console.log("平台钱包:", platformWallet);
  console.log("==========================================");

  // 保存部署信息到文件
  const fs = require('fs');
  const deploymentInfo = {
    contractName: "Crowdfunding",
    contractAddress: await crowdfunding.getAddress(),
    deployer: deployer.address,
    platformWallet: platformWallet,
    transactionHash: crowdfunding.deploymentTransaction().hash,
    blockNumber: crowdfunding.deploymentTransaction().blockNumber,
    gasUsed: crowdfunding.deploymentTransaction().gasLimit.toString(),
    timestamp: new Date().toISOString(),
    network: (await deployer.provider.getNetwork()).name
  };

  fs.writeFileSync(
    'deployment-info.json', 
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("💾 部署信息已保存到 deployment-info.json");

  return await crowdfunding.getAddress();
}

// 处理错误
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ 部署失败:", error);
    process.exit(1);
  }); 