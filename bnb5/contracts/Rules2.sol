// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.10;

contract Rules {

    function solve(uint8 player1, uint8 player2) public pure returns (uint8) {
        // Always wins the player 2
        return 2;
    }
}

