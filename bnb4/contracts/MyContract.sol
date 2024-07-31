// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.10;
import "./TokenTicket.sol";

contract MyContract {
    address[16] public tickets;
    uint public balanceWei = 0;
    address payable public admin;
    event simpleConsoleLog(string message);
    TokenTicket private token;

    constructor(address payable _admin, TokenTicket _token) {
        admin = payable(_admin);
        token = _token;
    }

    function transferBalanceToAdmin () public {
        require(msg.sender == admin, "No eres el admin");
        
        admin.transfer(balanceWei);
        balanceWei = 0;
    }

    function changeAdmin(address payable newAdmin) public {
        require(msg.sender == admin, "No eres el admin");

        admin = newAdmin;
    }

    function getBalance() public view returns (uint, uint256) {
        return (balanceWei, payable(address(this)).balance);
    }

    function buyTiket(uint tiketIndex) payable public {
        // ComprobaciĆ³n
        require(tiketIndex >= 0 && tiketIndex <= 15);
        require(msg.value >= 0.01 ether, "Insuficient amount of BNB");

        balanceWei += msg.value;

        isTicketAvailable(tiketIndex);

        // msg.sender address del usuario que invoco al contrato
        tickets[tiketIndex] = msg.sender;
        token.mintConInfo(msg.sender, tiketIndex,"ACDC","23-23-23");
        emit simpleConsoleLog("Ticket comprado");
    }

    function isTicketAvailable(uint index) public view returns (bool) {
        require(tickets[index] == address(0), "Este ticket pertenece a otra persona");
        return true;
    }

    function getTikets() public view returns (address[16] memory) {
        return tickets;
    }

    function transferTicket(uint ticketIndex, address newOwner) public {
        require(ticketIndex >= 0 && ticketIndex <= 15);
        require(tickets[ticketIndex] == msg.sender, "No eres el dueno del ticket");
        require(newOwner != address(0), "Direccion no valida");

        tickets[ticketIndex] = newOwner;
    }
}