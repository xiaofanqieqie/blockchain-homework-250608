// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title Crowdfunding
 * @dev 产品众筹智能合约
 * @author Your Name
 * 
 * 功能特性：
 * - 创建众筹项目
 * - 用户投资参与
 * - 自动退款机制
 * - 资金安全保障
 * - 完整的事件记录
 */
contract Crowdfunding is ReentrancyGuard, Ownable {
    using SafeMath for uint256;

    // 项目状态枚举
    enum ProjectStatus {
        Active,     // 进行中
        Successful, // 成功
        Failed,     // 失败
        Withdrawn   // 已提取
    }

    // 众筹项目结构体
    struct Project {
        uint256 id;                    // 项目ID
        string title;                  // 项目标题
        string description;            // 项目描述
        address payable creator;       // 项目创建者
        uint256 goalAmount;           // 目标金额（wei）
        uint256 currentAmount;        // 当前募集金额
        uint256 deadline;             // 截止时间（时间戳）
        uint256 createdAt;            // 创建时间
        ProjectStatus status;         // 项目状态
        bool withdrawn;               // 是否已提取资金
        mapping(address => uint256) contributions; // 投资记录
        address[] contributors;       // 投资者列表
    }

    // 状态变量
    uint256 private projectCounter;
    mapping(uint256 => Project) public projects;
    mapping(address => uint256[]) public userProjects; // 用户创建的项目
    mapping(address => uint256[]) public userContributions; // 用户参与的项目

    // 平台手续费（基点，100 = 1%）
    uint256 public platformFeeRate = 250; // 2.5%
    address payable public platformWallet;

    // 最小众筹目标和最小投资金额（支持小数，精度更高）
    uint256 public constant MIN_GOAL_AMOUNT = 0.001 ether;  // 0.001 ETH = 1000000000000000 wei
    uint256 public constant MIN_CONTRIBUTION = 0.0001 ether; // 0.0001 ETH = 100000000000000 wei
    uint256 public constant MIN_DURATION = 3600; // 1小时 = 3600秒
    uint256 public constant MAX_DURATION = 7776000; // 90天 = 90 * 24 * 3600 = 7776000秒

    // 事件定义
    event ProjectCreated(
        uint256 indexed projectId,
        address indexed creator,
        string title,
        uint256 goalAmount,
        uint256 deadline
    );

    event ContributionMade(
        uint256 indexed projectId,
        address indexed contributor,
        uint256 amount,
        uint256 currentTotal
    );

    event ProjectSuccessful(
        uint256 indexed projectId,
        uint256 totalAmount
    );

    event ProjectFailed(
        uint256 indexed projectId,
        uint256 totalAmount
    );

    event FundsWithdrawn(
        uint256 indexed projectId,
        address indexed creator,
        uint256 amount,
        uint256 platformFee
    );

    event RefundIssued(
        uint256 indexed projectId,
        address indexed contributor,
        uint256 amount
    );

    event PlatformFeeUpdated(uint256 oldRate, uint256 newRate);

    // 修饰符
    modifier projectExists(uint256 _projectId) {
        require(_projectId > 0 && _projectId <= projectCounter, "Project does not exist");
        _;
    }

    modifier onlyProjectCreator(uint256 _projectId) {
        require(projects[_projectId].creator == msg.sender, "Only project creator can call this");
        _;
    }

    modifier projectActive(uint256 _projectId) {
        require(projects[_projectId].status == ProjectStatus.Active, "Project is not active");
        require(block.timestamp < projects[_projectId].deadline, "Project deadline has passed");
        _;
    }

    constructor(address payable _platformWallet) {
        require(_platformWallet != address(0), "Platform wallet cannot be zero address");
        platformWallet = _platformWallet;
    }

    /**
     * @dev 创建众筹项目
     * @param _title 项目标题
     * @param _description 项目描述
     * @param _goalAmount 目标金额（wei）
     * @param _durationInSeconds 众筹持续时间（秒）
     */
    function createProject(
        string memory _title,
        string memory _description,
        uint256 _goalAmount,
        uint256 _durationInSeconds
    ) external returns (uint256) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(_goalAmount >= MIN_GOAL_AMOUNT, "Goal amount too low");
        require(_durationInSeconds >= MIN_DURATION, "Duration too short");
        require(_durationInSeconds <= MAX_DURATION, "Duration too long");

        projectCounter++;
        uint256 projectId = projectCounter;

        Project storage newProject = projects[projectId];
        newProject.id = projectId;
        newProject.title = _title;
        newProject.description = _description;
        newProject.creator = payable(msg.sender);
        newProject.goalAmount = _goalAmount;
        newProject.currentAmount = 0;
        newProject.deadline = block.timestamp + _durationInSeconds;
        newProject.createdAt = block.timestamp;
        newProject.status = ProjectStatus.Active;
        newProject.withdrawn = false;

        userProjects[msg.sender].push(projectId);

        emit ProjectCreated(
            projectId,
            msg.sender,
            _title,
            _goalAmount,
            newProject.deadline
        );

        return projectId;
    }

    /**
     * @dev 向项目投资
     * @param _projectId 项目ID
     */
    function contribute(uint256 _projectId) 
        external 
        payable 
        projectExists(_projectId)
        projectActive(_projectId)
        nonReentrant
    {
        require(msg.value >= MIN_CONTRIBUTION, "Contribution amount too low");
        // require(msg.sender != projects[_projectId].creator, "Creator cannot contribute to own project"); // 允许创建者投资自己的项目

        Project storage project = projects[_projectId];
        
        // 记录投资
        if (project.contributions[msg.sender] == 0) {
            project.contributors.push(msg.sender);
            userContributions[msg.sender].push(_projectId);
        }
        
        project.contributions[msg.sender] = project.contributions[msg.sender].add(msg.value);
        project.currentAmount = project.currentAmount.add(msg.value);

        emit ContributionMade(_projectId, msg.sender, msg.value, project.currentAmount);

        // 检查是否达到目标
        if (project.currentAmount >= project.goalAmount) {
            project.status = ProjectStatus.Successful;
            emit ProjectSuccessful(_projectId, project.currentAmount);
        }
    }

    /**
     * @dev 提取众筹资金（仅项目创建者，且项目成功）
     * @param _projectId 项目ID
     */
    function withdrawFunds(uint256 _projectId) 
        external 
        projectExists(_projectId)
        onlyProjectCreator(_projectId)
        nonReentrant
    {
        Project storage project = projects[_projectId];
        
        require(project.status == ProjectStatus.Successful, "Project must be successful");
        require(!project.withdrawn, "Funds already withdrawn");
        require(project.currentAmount > 0, "No funds to withdraw");

        project.withdrawn = true;
        project.status = ProjectStatus.Withdrawn;

        uint256 platformFee = project.currentAmount.mul(platformFeeRate).div(10000);
        uint256 creatorAmount = project.currentAmount.sub(platformFee);

        // 发送平台手续费
        if (platformFee > 0) {
            platformWallet.transfer(platformFee);
        }

        // 发送项目资金给创建者
        project.creator.transfer(creatorAmount);

        emit FundsWithdrawn(_projectId, project.creator, creatorAmount, platformFee);
    }

    /**
     * @dev 申请退款（项目失败或未达到目标）
     * @param _projectId 项目ID
     */
    function requestRefund(uint256 _projectId) 
        external 
        projectExists(_projectId)
        nonReentrant
    {
        Project storage project = projects[_projectId];
        
        // 检查退款条件
        require(
            project.status == ProjectStatus.Failed || 
            (block.timestamp >= project.deadline && project.currentAmount < project.goalAmount),
            "Refund not available"
        );
        
        uint256 contributionAmount = project.contributions[msg.sender];
        require(contributionAmount > 0, "No contribution found");

        // 更新项目状态
        if (project.status == ProjectStatus.Active) {
            project.status = ProjectStatus.Failed;
            emit ProjectFailed(_projectId, project.currentAmount);
        }

        // 清除投资记录
        project.contributions[msg.sender] = 0;
        project.currentAmount = project.currentAmount.sub(contributionAmount);

        // 发送退款
        payable(msg.sender).transfer(contributionAmount);

        emit RefundIssued(_projectId, msg.sender, contributionAmount);
    }

    /**
     * @dev 强制标记项目为失败（项目创建者可在截止日期前主动结束）
     * @param _projectId 项目ID
     */
    function cancelProject(uint256 _projectId) 
        external 
        projectExists(_projectId)
        onlyProjectCreator(_projectId)
    {
        Project storage project = projects[_projectId];
        require(project.status == ProjectStatus.Active, "Project is not active");
        
        project.status = ProjectStatus.Failed;
        emit ProjectFailed(_projectId, project.currentAmount);
    }

    // ===== 查询函数 =====

    /**
     * @dev 获取项目详细信息
     */
    function getProject(uint256 _projectId) 
        external 
        view 
        projectExists(_projectId)
        returns (
            uint256 id,
            string memory title,
            string memory description,
            address creator,
            uint256 goalAmount,
            uint256 currentAmount,
            uint256 deadline,
            uint256 createdAt,
            ProjectStatus status,
            bool withdrawn,
            uint256 contributorsCount
        )
    {
        Project storage project = projects[_projectId];
        return (
            project.id,
            project.title,
            project.description,
            project.creator,
            project.goalAmount,
            project.currentAmount,
            project.deadline,
            project.createdAt,
            project.status,
            project.withdrawn,
            project.contributors.length
        );
    }

    /**
     * @dev 获取用户在特定项目中的投资金额
     */
    function getUserContribution(uint256 _projectId, address _user) 
        external 
        view 
        projectExists(_projectId)
        returns (uint256)
    {
        return projects[_projectId].contributions[_user];
    }

    /**
     * @dev 获取项目的投资者列表
     */
    function getProjectContributors(uint256 _projectId) 
        external 
        view 
        projectExists(_projectId)
        returns (address[] memory)
    {
        return projects[_projectId].contributors;
    }

    /**
     * @dev 获取用户创建的项目列表
     */
    function getUserCreatedProjects(address _user) 
        external 
        view 
        returns (uint256[] memory)
    {
        return userProjects[_user];
    }

    /**
     * @dev 获取用户参与的项目列表
     */
    function getUserParticipatedProjects(address _user) 
        external 
        view 
        returns (uint256[] memory)
    {
        return userContributions[_user];
    }

    /**
     * @dev 获取当前项目总数
     */
    function getTotalProjects() external view returns (uint256) {
        return projectCounter;
    }

    /**
     * @dev 计算项目成功率
     */
    function getProjectSuccessRate() external view returns (uint256) {
        if (projectCounter == 0) return 0;
        
        uint256 successfulCount = 0;
        for (uint256 i = 1; i <= projectCounter; i++) {
            if (projects[i].status == ProjectStatus.Successful || 
                projects[i].status == ProjectStatus.Withdrawn) {
                successfulCount++;
            }
        }
        
        return successfulCount.mul(100).div(projectCounter);
    }

    // ===== 管理员函数 =====

    /**
     * @dev 更新平台手续费率（仅合约所有者）
     */
    function updatePlatformFeeRate(uint256 _newRate) external onlyOwner {
        require(_newRate <= 1000, "Fee rate cannot exceed 10%"); // 最大10%
        
        uint256 oldRate = platformFeeRate;
        platformFeeRate = _newRate;
        
        emit PlatformFeeUpdated(oldRate, _newRate);
    }

    /**
     * @dev 更新平台钱包地址（仅合约所有者）
     */
    function updatePlatformWallet(address payable _newWallet) external onlyOwner {
        require(_newWallet != address(0), "Platform wallet cannot be zero address");
        platformWallet = _newWallet;
    }

    /**
     * @dev 紧急暂停功能：标记问题项目为失败（仅合约所有者）
     */
    function emergencyFailProject(uint256 _projectId) external onlyOwner projectExists(_projectId) {
        Project storage project = projects[_projectId];
        require(project.status == ProjectStatus.Active, "Project is not active");
        
        project.status = ProjectStatus.Failed;
        emit ProjectFailed(_projectId, project.currentAmount);
    }

    // ===== 接收以太币 =====
    
    /**
     * @dev 合约接收以太币的回退函数
     */
    receive() external payable {
        revert("Direct payments not accepted. Use contribute function.");
    }

    /**
     * @dev 回退函数
     */
    fallback() external payable {
        revert("Function not found. Use contribute function.");
    }
} 