// 挖矿控制脚本
console.log("=== 挖矿控制面板 ===");

// 检查当前挖矿状态
function checkMiningStatus() {
    console.log("挖矿状态:", eth.mining ? "进行中" : "已停止");
    console.log("当前区块:", eth.blockNumber);
    console.log("待处理交易:", eth.pendingTransactions.length);
}

// 开始挖矿
function startMining(threads) {
    if (threads === undefined) threads = 1;
    console.log("开始挖矿 (" + threads + " 线程)...");
    miner.start(threads);
    setTimeout(function() {
        checkMiningStatus();
    }, 2000);
}

// 停止挖矿
function stopMining() {
    console.log("停止挖矿...");
    miner.stop();
    setTimeout(function() {
        checkMiningStatus();
    }, 1000);
}

// 挖指定数量的区块
function mineBlocks(numBlocks) {
    console.log("开始挖 " + numBlocks + " 个区块...");
    var startBlock = eth.blockNumber;
    miner.start(1);
    
    // 检查是否达到目标区块数
    var checkInterval = setInterval(function() {
        var currentBlock = eth.blockNumber;
        var minedBlocks = currentBlock - startBlock;
        console.log("已挖出 " + minedBlocks + "/" + numBlocks + " 个区块");
        
        if (minedBlocks >= numBlocks) {
            miner.stop();
            console.log("完成！总共挖出 " + minedBlocks + " 个区块");
            clearInterval(checkInterval);
        }
    }, 2000);
}

// 初始状态检查
checkMiningStatus();

console.log("\n可用命令:");
console.log("- checkMiningStatus()  // 检查挖矿状态");
console.log("- startMining(threads) // 开始挖矿");
console.log("- stopMining()         // 停止挖矿");
console.log("- mineBlocks(num)      // 挖指定数量区块"); 