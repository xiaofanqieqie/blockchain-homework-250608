// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HelloWorld {
    string private message;
    address public owner;
    
    event MessageChanged(string newMessage, address changedBy);
    
    constructor() {
        message = "Hello, World!";
        owner = msg.sender;
    }
    
    function setMessage(string memory _message) public {
        message = _message;
        emit MessageChanged(_message, msg.sender);
    }
    
    function getMessage() public view returns (string memory) {
        return message;
    }
    
    function getOwner() public view returns (address) {
        return owner;
    }
} 