// 简单智能合约测试脚本 (ES5兼容版本)
console.log("=== 智能合约测试工具 ===");

// 合约 ABI
var contractABI = [
    {
        "constant": false,
        "inputs": [{"name": "x", "type": "uint256"}],
        "name": "set",
        "outputs": [],
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "get",
        "outputs": [{"name": "", "type": "uint256"}],
        "type": "function"
    }
];

// 合约字节码
var contractBytecode = "0x608060405234801561001057600080fd5b5060df8061001f6000396000f3006080604052600436106049576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b114604e5780636d4ce63c146078575b600080fd5b348015605957600080fd5b5060766004803603810190808035906020019092919050505060a0565b005b348015608357600080fd5b50608a60aa565b6040518082815260200191505060405180910390f35b8060008190555050565b600080549050905600a165627a7a7230582061b7676067d537e410bb704932a9984739a04ce3c1856f27f87c2a82c8d5036c0029";

// 部署合约
function deployContract() {
    console.log("开始部署智能合约...");
    
    var mainAccount = eth.coinbase;
    try {
        personal.unlockAccount(mainAccount, "password", 300);
        console.log("账户已解锁");
    } catch (error) {
        console.log("账户解锁失败:", error.message);
        return null;
    }
    
    var SimpleStorageContract = web3.eth.contract(contractABI);
    
    try {
        var contractInstance = SimpleStorageContract.new({
            from: mainAccount,
            data: contractBytecode,
            gas: 1000000
        });
        
        console.log("合约部署交易已发送");
        console.log("交易哈希:", contractInstance.transactionHash);
        console.log("等待挖矿确认...");
        console.log("请手动检查: eth.getTransactionReceipt('" + contractInstance.transactionHash + "')");
        
        return contractInstance;
        
    } catch (error) {
        console.log("合约部署失败:", error.message);
        return null;
    }
}

// 连接到已部署的合约
function connectContract(contractAddress) {
    if (!contractAddress) {
        console.log("请提供合约地址");
        return null;
    }
    
    console.log("连接到合约:", contractAddress);
    var SimpleStorageContract = web3.eth.contract(contractABI);
    var contract = SimpleStorageContract.at(contractAddress);
    
    return contract;
}

// 设置合约值
function setContractValue(contract, value) {
    var mainAccount = eth.coinbase;
    try {
        personal.unlockAccount(mainAccount, "password", 300);
        var txHash = contract.set(value, {
            from: mainAccount,
            gas: 100000
        });
        console.log("设置值交易已发送:", txHash);
        return txHash;
    } catch (error) {
        console.log("设置值失败:", error.message);
        return null;
    }
}

// 获取合约值
function getContractValue(contract) {
    try {
        var value = contract.get();
        console.log("当前存储的值:", value.toString());
        return value;
    } catch (error) {
        console.log("获取值失败:", error.message);
        return null;
    }
}

console.log("\n智能合约命令:");
console.log("- deployContract()                           // 部署合约");
console.log("- connectContract(address)                   // 连接到合约");
console.log("- setContractValue(contract, value)          // 设置值");
console.log("- getContractValue(contract)                 // 获取值");

console.log("\n使用示例:");
console.log("1. var contract = deployContract()");
console.log("2. 等待挖矿确认部署...");
console.log("3. var myContract = connectContract('合约地址')");
console.log("4. setContractValue(myContract, 123)");
console.log("5. getContractValue(myContract)"); 