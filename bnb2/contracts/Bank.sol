// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10;
import "./Token.sol";

contract Bank {
    //assign Token contract to variable
    Token private token;
    // hash address - uint
    mapping(address => uint) public clientsBalanceBNB;
    mapping(address => uint) public depositTimeStamp;
    mapping(address => bool) public isDeposited;
    
    //pass as constructor argument deployed Token contract
    constructor(Token _token) {
        //assign token deployed contract to variable
        token = _token;
    }

    function deposit() payable public {
        clientsBalanceBNB[msg.sender] = clientsBalanceBNB[msg.sender] + msg.value;
        depositTimeStamp[msg.sender] = block.timestamp;
        isDeposited[msg.sender] = true;
    }

    function withdraw() payable public {
        require(isDeposited[msg.sender] == true, 'Error, no previous deposit');
        require(msg.value == 0.05 ether, "You should pay 0.05 BNB to withdraw the money");

        // interest BMIW
        uint interest = calculateBMIW();

        // return the BNB to original wallet
        payable(msg.sender).transfer(clientsBalanceBNB[msg.sender] - 0.008 ether);
        clientsBalanceBNB[msg.sender] = 0;

        // Crear el token y lo envia a la addres del msg.sender
        token.mint(msg.sender, interest);
        // reiniciar reposito
        depositTimeStamp[msg.sender] = 0;
        isDeposited[msg.sender] = false;

    }

    function calculateBMIW() view private returns (uint) {
        uint depositTotalTime = block.timestamp - depositTimeStamp[msg.sender];
        uint interestPerSecond = (100*clientsBalanceBNB[msg.sender]) / 31668017;
        return interestPerSecond * depositTotalTime;
    }

    function getBNB() view public returns (uint) {
        return clientsBalanceBNB[msg.sender] == 0 ? 0 : clientsBalanceBNB[msg.sender] - 0.008 ether;
    }

    function getBMIW() view public returns (uint) {
        return calculateBMIW();
    }

}
