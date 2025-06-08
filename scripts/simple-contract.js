// 简单智能合约测试脚本
console.log("=== 智能合约测试工具 ===");

// 简单的存储合约 Solidity 代码
var contractSource = "pragma solidity ^0.4.18; contract SimpleStorage { uint256 storedData; function set(uint256 x) public { storedData = x; } function get() public view returns (uint256) { return storedData; } }";

// 合约 ABI (Application Binary Interface)
var contractABI = [
    {
        "constant": false,
        "inputs": [{"name": "x", "type": "uint256"}],
        "name": "set",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "get",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];

// 合约字节码 (需要编译 Solidity 代码获得)
var contractBytecode = "0x608060405234801561001057600080fd5b5060df8061001f6000396000f3006080604052600436106049576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b114604e5780636d4ce63c146078575b600080fd5b348015605957600080fd5b5060766004803603810190808035906020019092919050505060a0565b005b348015608357600080fd5b50608a60aa565b6040518082815260200191505060405180910390f35b8060008190555050565b600080549050905600a165627a7a7230582061b7676067d537e410bb704932a9984739a04ce3c1856f27f87c2a82c8d5036c0029";

// 部署合约
function deployContract() {
    console.log("开始部署智能合约...");
    
    // 确保主账户已解锁
    let mainAccount = eth.coinbase;
    try {
        personal.unlockAccount(mainAccount, "password", 300);
        console.log("账户已解锁");
    } catch (error) {
        console.log("账户解锁失败:", error.message);
        return null;
    }
    
    // 创建合约对象
    let SimpleStorageContract = web3.eth.contract(contractABI);
    
    try {
        // 部署合约
        let contractInstance = SimpleStorageContract.new({
            from: mainAccount,
            data: contractBytecode,
            gas: 1000000
        });
        
        console.log("合约部署交易已发送");
        console.log("交易哈希:", contractInstance.transactionHash);
        console.log("等待挖矿确认...");
        
        // 等待合约部署完成
        let checkDeployment = setInterval(() => {
            let receipt = eth.getTransactionReceipt(contractInstance.transactionHash);
            if (receipt && receipt.contractAddress) {
                console.log("合约部署成功！");
                console.log("合约地址:", receipt.contractAddress);
                clearInterval(checkDeployment);
                
                // 返回已部署的合约实例
                let deployedContract = SimpleStorageContract.at(receipt.contractAddress);
                window.deployedContract = deployedContract; // 保存到全局变量
                
                console.log("\n可以使用以下命令与合约交互:");
                console.log("- deployedContract.set(123, {from: eth.coinbase, gas: 100000})");
                console.log("- deployedContract.get()");
                
                return deployedContract;
            }
        }, 2000);
        
        return contractInstance;
        
    } catch (error) {
        console.log("合约部署失败:", error.message);
        return null;
    }
}

// 与已部署的合约交互
function interactWithContract(contractAddress) {
    if (!contractAddress) {
        console.log("请提供合约地址");
        return null;
    }
    
    console.log("连接到合约:", contractAddress);
    let SimpleStorageContract = web3.eth.contract(contractABI);
    let contract = SimpleStorageContract.at(contractAddress);
    
    // 定义交互函数
    contract.setValue = function(value) {
        let mainAccount = eth.coinbase;
        try {
            personal.unlockAccount(mainAccount, "password", 300);
            let txHash = contract.set(value, {
                from: mainAccount,
                gas: 100000
            });
            console.log("设置值交易已发送:", txHash);
            return txHash;
        } catch (error) {
            console.log("设置值失败:", error.message);
            return null;
        }
    };
    
    contract.getValue = function() {
        try {
            let value = contract.get();
            console.log("当前存储的值:", value.toString());
            return value;
        } catch (error) {
            console.log("获取值失败:", error.message);
            return null;
        }
    };
    
    window.contract = contract; // 保存到全局变量
    
    console.log("\n合约交互命令:");
    console.log("- contract.setValue(123)  // 设置值");
    console.log("- contract.getValue()     // 获取值");
    
    return contract;
}

// 查看合约事件
function getContractEvents(contractAddress) {
    if (!contractAddress) {
        console.log("请提供合约地址");
        return;
    }
    
    let SimpleStorageContract = web3.eth.contract(contractABI);
    let contract = SimpleStorageContract.at(contractAddress);
    
    // 获取所有事件
    let events = contract.allEvents({
        fromBlock: 0,
        toBlock: 'latest'
    });
    
    events.get((error, logs) => {
        if (error) {
            console.log("获取事件失败:", error);
        } else {
            console.log("合约事件:");
            logs.forEach((log, index) => {
                console.log(`事件 ${index + 1}:`, log);
            });
        }
    });
}

console.log("\n智能合约命令:");
console.log("- deployContract()                    // 部署简单存储合约");
console.log("- interactWithContract(address)       // 连接到已部署的合约");
console.log("- getContractEvents(address)          // 查看合约事件");

console.log("\n注意: 部署合约前请确保:");
console.log("1. 账户有足够的 ETH 用于 gas");
console.log("2. 正在进行挖矿以确认交易"); 