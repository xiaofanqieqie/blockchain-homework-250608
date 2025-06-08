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
          "0xf78731a1259d779ee98fdd253907c459bf26f750e54056368587882c2b222cf1"
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
          "0xf78731a1259d779ee98fdd253907c459bf26f750e54056368587882c2b222cf1"
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