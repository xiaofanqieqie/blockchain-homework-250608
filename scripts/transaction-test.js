// 交易测试脚本
console.log("=== 交易测试工具 ===");

// 创建新账户
function createAccount(password) {
    if (password === undefined) password = "password";
    var newAccount = personal.newAccount(password);
    console.log("新账户创建成功:", newAccount);
    return newAccount;
}

// 解锁账户
function unlockAccount(account, password, duration) {
    if (password === undefined) password = "password";
    if (duration === undefined) duration = 300;
    try {
        var result = personal.unlockAccount(account, password, duration);
        console.log("账户解锁:", result ? "成功" : "失败");
        return result;
    } catch (error) {
        console.log("解锁失败:", error.message);
        return false;
    }
}

// 发送交易
function sendTransaction(from, to, amount) {
    try {
        console.log("发送交易: " + amount + " ETH");
        console.log("从: " + from);
        console.log("到: " + to);
        
        var txHash = eth.sendTransaction({
            from: from,
            to: to,
            value: web3.toWei(amount, "ether"),
            gas: 21000
        });
        
        console.log("交易哈希:", txHash);
        console.log("等待挖矿确认...");
        
        // 检查交易状态
        setTimeout(function() {
            var receipt = eth.getTransactionReceipt(txHash);
            if (receipt) {
                console.log("交易已确认！区块号:", receipt.blockNumber);
            } else {
                console.log("交易仍在待处理中...");
            }
        }, 5000);
        
        return txHash;
    } catch (error) {
        console.log("交易失败:", error.message);
        return null;
    }
}

// 快速转账函数
function quickTransfer(toAddress, amount) {
    var fromAccount = eth.coinbase;
    
    // 检查余额
    var balance = web3.fromWei(eth.getBalance(fromAccount), "ether");
    console.log("当前余额: " + balance + " ETH");
    
    if (parseFloat(balance) < parseFloat(amount)) {
        console.log("余额不足！");
        return false;
    }
    
    // 确保账户已解锁
    if (!unlockAccount(fromAccount)) {
        return false;
    }
    
    return sendTransaction(fromAccount, toAddress, amount);
}

// 批量转账
function batchTransfer(recipients, amount) {
    console.log("批量转账: 每个地址 " + amount + " ETH");
    var results = [];
    
    for (var i = 0; i < recipients.length; i++) {
        console.log("\n转账 " + (i+1) + "/" + recipients.length + ":");
        var txHash = quickTransfer(recipients[i], amount);
        results.push({
            to: recipients[i],
            txHash: txHash,
            success: txHash !== null
        });
        
        // 延迟避免nonce冲突
        if (i < recipients.length - 1) {
            console.log("等待3秒...");
            // 在实际使用中这里需要适当的延迟
        }
    }
    
    console.log("\n批量转账结果:");
    for (var j = 0; j < results.length; j++) {
        var result = results[j];
        console.log((j+1) + ". " + result.to + ": " + (result.success ? '成功' : '失败'));
    }
    
    return results;
}

console.log("\n可用命令:");
console.log("- createAccount(password)                    // 创建新账户");
console.log("- unlockAccount(account, password, duration)  // 解锁账户");
console.log("- sendTransaction(from, to, amount)          // 发送交易");
console.log("- quickTransfer(toAddress, amount)           // 快速转账");
console.log("- batchTransfer([addresses], amount)         // 批量转账");

// 显示当前账户状态
console.log("\n当前账户:");
for (var k = 0; k < eth.accounts.length; k++) {
    var account = eth.accounts[k];
    var balance = web3.fromWei(eth.getBalance(account), "ether");
    console.log("[" + k + "] " + account + ": " + balance + " ETH");
} 