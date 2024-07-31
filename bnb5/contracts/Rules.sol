// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.10;

contract Rules {

    function solve(uint8 player1, uint8 player2) public pure returns (uint8) {
        uint8 STONE = 1;
        uint8 PAPER = 2;
        uint8 SCISSORS = 3;

        if (player1 == player2) {
            return 0;
        }
        
        // Determine the winner based on the game rules
        if ((player1 == STONE && player2 == SCISSORS) ||
            (player1 == SCISSORS && player2 == PAPER) ||
            (player1 == PAPER && player2 == STONE)) {
            return 1; // Player 1 wins
        } else {
            return 2; // Player 2 wins
        }
    }
}

