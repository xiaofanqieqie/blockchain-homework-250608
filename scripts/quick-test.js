// 快速测试脚本
console.log("=== 快速功能测试 ===");

// 1. 显示当前状态
console.log("当前区块:", eth.blockNumber);
console.log("账户余额:", web3.fromWei(eth.getBalance(eth.coinbase), "ether"), "ETH");
console.log("挖矿状态:", eth.mining);

// 2. 创建新账户进行测试
console.log("\n=== 测试账户创建 ===");
var newAccount = personal.newAccount("password");
console.log("新账户创建成功:", newAccount);

// 3. 测试转账功能
console.log("\n=== 测试转账功能 ===");
console.log("解锁主账户...");
personal.unlockAccount(eth.coinbase, "password", 300);

console.log("发送 5 ETH 到新账户...");
var txHash = eth.sendTransaction({
    from: eth.coinbase,
    to: newAccount,
    value: web3.toWei(5, "ether"),
    gas: 21000
});
console.log("交易哈希:", txHash);

// 4. 检查交易状态
console.log("\n=== 检查交易状态 ===");
console.log("等待交易确认...");
console.log("请手动运行: eth.getTransactionReceipt('" + txHash + "')");

// 5. 部署简单合约测试
console.log("\n=== 智能合约测试 ===");
var simpleABI = [{"constant":false,"inputs":[{"name":"x","type":"uint256"}],"name":"set","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"","type":"uint256"}],"type":"function"}];
var simpleBytecode = "0x608060405234801561001057600080fd5b5060df8061001f6000396000f3006080604052600436106049576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b114604e5780636d4ce63c146078575b600080fd5b348015605957600080fd5b5060766004803603810190808035906020019092919050505060a0565b005b348015608357600080fd5b50608a60aa565b6040518082815260200191505060405180910390f35b8060008190555050565b600080549050905600a165627a7a7230582061b7676067d537e410bb704932a9984739a04ce3c1856f27f87c2a82c8d5036c0029";

console.log("部署智能合约...");
var SimpleContract = web3.eth.contract(simpleABI);
var contractInstance = SimpleContract.new({
    from: eth.coinbase,
    data: simpleBytecode,
    gas: 1000000
});

console.log("合约部署交易:", contractInstance.transactionHash);

console.log("\n=== 测试完成 ===");
console.log("手动检查命令:");
console.log("1. eth.getBalance('" + newAccount + "') // 检查新账户余额");
console.log("2. eth.getTransactionReceipt('" + txHash + "') // 检查转账");
console.log("3. eth.getTransactionReceipt('" + contractInstance.transactionHash + "') // 检查合约部署");
console.log("4. 等待几个区块后再检查"); 