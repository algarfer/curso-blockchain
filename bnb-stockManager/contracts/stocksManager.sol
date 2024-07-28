// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.10;

contract StocksManager {
    mapping(address => uint) public usersAndStocks;
    uint public maxActions = 100;
    uint public actionsIssued;


    function buyAction() payable public {
        require(msg.value == 0.01 ether, "The value of an action is 0.01 BNB");
        require(actionsIssued + 1 <= maxActions, "There are no actions available");

        actionsIssued += 1;
        usersAndStocks[msg.sender] += 1;
    }

    function getNumberOfActions() view public returns (uint) {
        return usersAndStocks[msg.sender];
    }
}