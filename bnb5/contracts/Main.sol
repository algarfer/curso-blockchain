// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.10;
import "./Rules.sol";

contract Main {

    address payable public admin;
    Rules private rules;

    constructor(Rules _rules, address payable _admin) {
        rules = _rules;
        admin = payable(_admin);
    }

    function play(uint8 player1, uint8 player2) public view returns (uint8) {
        return rules.solve(player1, player2);
    }

    function setRules(Rules _rules) public {
        require(msg.sender == admin, "Only the admin can change the rules");
        rules = _rules;
    }

}
