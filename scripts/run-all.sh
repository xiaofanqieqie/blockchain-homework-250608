#!/bin/bash

echo "=== 以太坊私有网络交互脚本集合 ==="
echo "请选择要执行的脚本:"
echo "1. 网络信息查询 (network-info.js)"
echo "2. 挖矿控制面板 (mining-control.js)"
echo "3. 交易测试工具 (transaction-test.js)"
echo "4. 智能合约测试 (simple-contract.js)"
echo "5. 全部加载到控制台"
echo "0. 退出"

read -p "请输入选择 (0-5): " choice

case $choice in
    1)
        echo "加载网络信息查询脚本..."
        docker exec -i miner geth attach ~/data/geth.ipc < ./scripts/network-info.js
        ;;
    2)
        echo "加载挖矿控制脚本..."
        docker exec -i miner geth attach ~/data/geth.ipc < ./scripts/mining-control.js
        ;;
    3)
        echo "加载交易测试脚本..."
        docker exec -i miner geth attach ~/data/geth.ipc < ./scripts/transaction-test.js
        ;;
    4)
        echo "加载智能合约脚本..."
        docker exec -i miner geth attach ~/data/geth.ipc < ./scripts/simple-contract.js
        ;;
    5)
        echo "加载所有脚本到控制台..."
        echo "您将进入交互式控制台，所有功能都已加载"
        cat ./scripts/network-info.js ./scripts/mining-control.js ./scripts/transaction-test.js ./scripts/simple-contract.js > /tmp/all-scripts.js
        echo "console.log('=== 所有脚本已加载完成 ===');" >> /tmp/all-scripts.js
        docker exec -it miner sh -c "cat /tmp/all-scripts.js | geth attach ~/data/geth.ipc"
        ;;
    0)
        echo "退出"
        exit 0
        ;;
    *)
        echo "无效选择"
        exit 1
        ;;
esac 