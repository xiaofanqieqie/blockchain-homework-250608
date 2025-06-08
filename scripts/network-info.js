// 网络信息查询脚本
console.log("=== 以太坊网络信息 ===");
console.log("网络ID:", net.version);
console.log("链ID:", eth.chainId);
console.log("节点信息:", admin.nodeInfo.name);
console.log("当前区块高度:", eth.blockNumber);
console.log("Peers 数量:", net.peerCount);
console.log("是否在挖矿:", eth.mining);
console.log("算力 (Hashrate):", eth.hashrate);

console.log("\n=== 账户信息 ===");
console.log("主账户:", eth.coinbase);
console.log("所有账户:");
for (var i = 0; i < eth.accounts.length; i++) {
    var account = eth.accounts[i];
    var balance = web3.fromWei(eth.getBalance(account), "ether");
    console.log("  [" + i + "] " + account + ": " + balance + " ETH");
}

console.log("\n=== 节点连接信息 ===");
console.log("Enode:", admin.nodeInfo.enode);
console.log("监听地址:", admin.nodeInfo.ip + ":" + admin.nodeInfo.ports.listener); 