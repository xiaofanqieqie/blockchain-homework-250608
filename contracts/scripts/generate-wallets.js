const { ethers } = require("hardhat");

async function generateWallets() {
  console.log("🔑 生成测试钱包工具");
  console.log("=".repeat(50));

  // 获取主账户（用于转账）
  const [mainAccount] = await ethers.getSigners();
  console.log("💳 主账户:", mainAccount.address);
  
  const mainBalance = await ethers.provider.getBalance(mainAccount.address);
  console.log("💰 主账户余额:", ethers.formatEther(mainBalance), "ETH\n");

  // 生成5个新钱包
  const walletCount = 5;
  const wallets = [];
  
  console.log("🆕 生成新钱包:");
  console.log("-".repeat(30));
  
  for (let i = 1; i <= walletCount; i++) {
    // 生成随机钱包
    const wallet = ethers.Wallet.createRandom();
    
    // 连接到当前provider
    const connectedWallet = wallet.connect(ethers.provider);
    wallets.push(connectedWallet);
    
    console.log(`[钱包 ${i}]`);
    console.log(`地址: ${wallet.address}`);
    console.log(`私钥: ${wallet.privateKey}`);
    console.log(`助记词: ${wallet.mnemonic.phrase}`);
    console.log();
  }

  // 给每个新钱包转一些ETH
  console.log("💸 向新钱包转账测试ETH:");
  console.log("-".repeat(30));
  
  const transferAmount = ethers.parseEther("100"); // 给每个钱包100 ETH
  
  for (let i = 0; i < wallets.length; i++) {
    const wallet = wallets[i];
    
    try {
      console.log(`向钱包 ${i + 1} (${wallet.address}) 转账 100 ETH...`);
      
      const tx = await mainAccount.sendTransaction({
        to: wallet.address,
        value: transferAmount
      });
      
      console.log(`⏳ 交易哈希: ${tx.hash}`);
      await tx.wait();
      console.log(`✅ 转账成功!`);
      
      // 验证余额
      const balance = await ethers.provider.getBalance(wallet.address);
      console.log(`💰 新余额: ${ethers.formatEther(balance)} ETH\n`);
      
    } catch (error) {
      console.error(`❌ 转账失败:`, error.message);
    }
  }

  // 生成Hardhat配置代码
  console.log("⚙️ Hardhat配置代码:");
  console.log("-".repeat(30));
  
  const privateKeys = wallets.map(w => `"${w.privateKey}"`).join(',\n        ');
  
  console.log(`accounts: [
        // 主账户
        "${mainAccount.privateKey || '你的主账户私钥'}",
        // 测试账户
        ${privateKeys}
      ]`);

  // 保存到文件
  const walletData = {
    timestamp: new Date().toISOString(),
    mainAccount: {
      address: mainAccount.address,
      privateKey: mainAccount.privateKey || "已隐藏"
    },
    testWallets: wallets.map((wallet, index) => ({
      id: index + 1,
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic.phrase
    }))
  };

  require('fs').writeFileSync(
    'test-wallets.json', 
    JSON.stringify(walletData, null, 2)
  );
  
  console.log("\n💾 钱包信息已保存到 test-wallets.json");
  
  // 显示使用建议
  console.log("\n📋 使用建议:");
  console.log("-".repeat(30));
  console.log("1. 可以将私钥添加到 hardhat.config.js 的 accounts 数组中");
  console.log("2. 在交互式测试工具中切换不同账户进行测试");
  console.log("3. 测试多用户投资场景");
  console.log("4. 测试项目创建者和投资者的不同角色");
  
  return wallets;
}

// 如果直接运行此脚本
if (require.main === module) {
  generateWallets().catch(console.error);
}

module.exports = { generateWallets }; 