require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    // 本地开发网络
    localhost: {
      url: "http://152.53.165.85:8545",
      chainId: 88,
      accounts: [
        // 私有网络主账户私钥 (从keystore解密获得)
        "0xf78731a1259d779ee98fdd253907c459bf26f750e54056368587882c2b222cf1",
        // 测试账户私钥
        "0x1527ce39fd1379fcdfe57a4c1b3da54c325bfc2681818c171154dbb288c7464d",
        "0xb8f98b8858efab330aae8cadf59a4eb3864e5b125f190271d08ed909e8e1ec95", 
        "0x859388e2ab9425e325366195665f4f010eb39890db9162e9f1114212e460b35d",
        "0xbf7911c6756af5b8f99e80c06726f3f2a3070a7e4b14c37d3eae7e187413013f",
        "0xbe13b809e0f252f36f8ca7c12702317d9374804e79d902a6cb43a4dc84963b0f"
      ],
      gas: 2100000,
      gasPrice: 8000000000
    },
    // 你的私有网络
    private: {
      url: "http://152.53.165.85:8545",
      chainId: 88,
      accounts: [
        // 私有网络主账户私钥 (从keystore解密获得)
        "0xf78731a1259d779ee98fdd253907c459bf26f750e54056368587882c2b222cf1",
        // 测试账户私钥
        "0x1527ce39fd1379fcdfe57a4c1b3da54c325bfc2681818c171154dbb288c7464d",
        "0xb8f98b8858efab330aae8cadf59a4eb3864e5b125f190271d08ed909e8e1ec95", 
        "0x859388e2ab9425e325366195665f4f010eb39890db9162e9f1114212e460b35d",
        "0xbf7911c6756af5b8f99e80c06726f3f2a3070a7e4b14c37d3eae7e187413013f",
        "0xbe13b809e0f252f36f8ca7c12702317d9374804e79d902a6cb43a4dc84963b0f"
      ],
      gas: 2100000,
      gasPrice: 8000000000
    },
    // Hardhat本地测试网络
    hardhat: {
      chainId: 31337
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD"
  },
  etherscan: {
    // 如果需要验证合约，在这里配置API key
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
}; 