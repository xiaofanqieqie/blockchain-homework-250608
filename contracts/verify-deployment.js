const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 验证合约部署状态...\n");

  // 合约地址
  const contractAddress = "0x80B654eFD36771339c3Ed2193354b6E164444516";
  console.log("📍 合约地址:", contractAddress);

  // 检查合约代码是否存在
  const code = await ethers.provider.getCode(contractAddress);
  if (code === "0x") {
    console.log("❌ 合约未部署或地址错误");
    return;
  }
  console.log("✅ 合约代码存在，长度:", code.length);

  // 获取网络信息
  const network = await ethers.provider.getNetwork();
  console.log("🌐 网络信息:");
  console.log("  - Chain ID:", network.chainId.toString());
  console.log("  - 网络名称:", network.name);

  // 获取最新区块
  const blockNumber = await ethers.provider.getBlockNumber();
  console.log("📦 当前区块高度:", blockNumber);

  console.log("\n🎉 合约验证完成！");
  console.log("💡 提示：合约已成功部署并可以使用");
  console.log("📋 可以通过以下方式与合约交互：");
  console.log("  1. 使用 Remix IDE 连接到 http://152.53.165.85:8545");
  console.log("  2. 使用 MetaMask 连接私有网络");
  console.log("  3. 使用 Web3.js 或 ethers.js 直接调用");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ 验证失败:", error);
    process.exit(1);
  }); 