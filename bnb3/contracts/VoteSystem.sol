// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10;
import "./TokenVote.sol";

contract VoteSystem{
    //assign Token contract to variable
    TokenVote private token;

    mapping(address => bool) public alreadyOrderTokens;
    uint256 votesOption1 = 0;
    uint256 votesOption2 = 0;

    constructor(TokenVote _token) {
        token = _token;
    }

    function getVotesOption1() public view returns (uint256) {
        return votesOption1;
    }

    function getVotesOption2() public view returns (uint256) {
        return votesOption2;
    }

    function giveTokens() payable public {
        if (alreadyOrderTokens[msg.sender] != true ){
            uint256 numeroDeTokens = getRandomNumber() * 1000000000000000000;
            token.mint(msg.sender, numeroDeTokens);
            alreadyOrderTokens[msg.sender] = true;
        }
    }

    function vote(uint8 option) payable public {
        uint256 balanceToken = token.balanceOf(msg.sender);

        if ( balanceToken > 0) {
            uint256 numVotesInYourWallet = balanceToken/1000000000000000000;
            if ( option == 1) {
                votesOption1 = votesOption1+numVotesInYourWallet;
            }
            if ( option == 2) {
                votesOption2 = votesOption2+numVotesInYourWallet;
            }
        }
    }


    function getRandomNumber() private view returns (uint8) {
        uint256 randomNumber =
            uint8(uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty))) % 10) + 1;
        return uint8(randomNumber);
    }

}
