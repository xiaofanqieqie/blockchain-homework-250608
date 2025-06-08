const { Web3 } = require('web3');

// 区块链连接配置
const RPC_URL = 'http://152.53.165.85:8545';
const NETWORK_ID = 88;

console.log("=== 测试外部 Web3 连接 ===");
console.log(`连接地址: ${RPC_URL}`);
console.log(`目标网络ID: ${NETWORK_ID}`);

async function testConnection() {
    try {
        // 创建 Web3 实例
        const web3 = new Web3(RPC_URL);
        
        console.log("\n✅ Web3 实例创建成功");
        
        // 测试连接
        console.log("\n1. 测试基本连接...");
        const isConnected = await web3.eth.net.isListening();
        console.log("连接状态:", isConnected ? "✅ 已连接" : "❌ 连接失败");
        
        // 获取网络信息
        console.log("\n2. 获取网络信息...");
        const networkId = await web3.eth.net.getId();
        console.log("网络ID:", networkId);
        
        // 尝试获取链ID（可能不支持）
        try {
            const chainId = await web3.eth.getChainId();
            console.log("链ID:", chainId);
        } catch (chainError) {
            console.log("链ID: ⚠️  不支持 eth_chainId 方法 (使用网络ID代替)");
        }
        
        // 验证网络ID
        if (Number(networkId) == NETWORK_ID) {
            console.log("✅ 网络ID 匹配");
        } else {
            console.log(`❌ 网络ID 不匹配，期望: ${NETWORK_ID}, 实际: ${Number(networkId)}`);
        }
        
        // 获取当前区块号
        console.log("\n3. 获取区块信息...");
        const blockNumber = await web3.eth.getBlockNumber();
        console.log("当前区块号:", blockNumber);
        
        // 获取最新区块
        const latestBlock = await web3.eth.getBlock('latest');
        console.log("最新区块哈希:", latestBlock.hash);
        console.log("区块时间戳:", new Date(Number(latestBlock.timestamp) * 1000).toLocaleString());
        
        // 获取账户列表
        console.log("\n4. 获取账户信息...");
        try {
            const accounts = await web3.eth.getAccounts();
            console.log("账户数量:", accounts.length);
            
            if (accounts.length > 0) {
                for (let i = 0; i < Math.min(accounts.length, 5); i++) {
                    const account = accounts[i];
                    const balance = await web3.eth.getBalance(account);
                    const balanceEth = web3.utils.fromWei(balance, 'ether');
                    console.log(`账户 ${i}: ${account}`);
                    console.log(`  余额: ${balanceEth} ETH`);
                }
            } else {
                console.log("⚠️  没有找到账户，可能需要解锁账户");
            }
        } catch (accountError) {
            console.log("⚠️  获取账户失败:", accountError.message);
            console.log("   这可能是正常的，有些节点不允许列出账户");
        }
        
        // 测试 Gas Price
        console.log("\n5. 获取 Gas 信息...");
        const gasPrice = await web3.eth.getGasPrice();
        console.log("当前 Gas Price:", web3.utils.fromWei(gasPrice, 'gwei'), "Gwei");
        
        // 连接成功总结
        console.log("\n🎉 外部连接测试成功！");
        console.log("\n📋 Remix 连接配置:");
        console.log("- Environment: Web3 Provider");
        console.log(`- Web3 Provider Endpoint: ${RPC_URL}`);
        console.log("- 连接应该可以正常工作");
        
        return true;
        
    } catch (error) {
        console.log("\n❌ 连接测试失败:");
        console.log("错误信息:", error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.log("\n🔧 可能的解决方案:");
            console.log("1. 确保区块链节点正在运行");
            console.log("2. 检查端口 8545 是否开放");
            console.log("3. 确认防火墙设置");
            console.log("4. 验证 RPC 配置是否正确");
        } else if (error.message.includes('timeout')) {
            console.log("\n🔧 连接超时，可能的原因:");
            console.log("1. 网络延迟过高");
            console.log("2. 服务器响应慢");
            console.log("3. 防火墙阻塞");
        }
        
        return false;
    }
}

// 执行测试
testConnection().then(success => {
    if (success) {
        console.log("\n✅ 测试完成，连接正常");
        process.exit(0);
    } else {
        console.log("\n❌ 测试失败，请检查配置");
        process.exit(1);
    }
}).catch(error => {
    console.log("\n💥 未预期的错误:", error);
    process.exit(1);
}); 