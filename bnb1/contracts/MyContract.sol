pragma solidity ^0.8.10;

contract MyContract {
    address[16] public tickets;
    uint public balanceWei = 0;
    address payable public admin;
    event simpleConsoleLog(string message);

    constructor(address payable _admin) {
        admin = payable(_admin);
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
        // Comprobación
        require(tiketIndex >= 0 && tiketIndex <= 15);
        require(msg.value == 0.02 ether, "Insuficient amount of BNB");

        balanceWei += msg.value;

        isTicketAvailable(tiketIndex);

        // msg.sender address del usuario que invoco al contrato
        tickets[tiketIndex] = msg.sender;
        emit simpleConsoleLog("Ticket comprado");
    }

    function isTicketAvailable(uint index) public view returns (bool) {
        require(tickets[index] == address(0), "Este ticket pertenece a otra persona");
        return true;
    }

    function getTikets() public view returns (address[16] memory) {
        return tickets;
    }
}