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

    function buyTiket(uint tiketIndex) payable public returns (bool) {
        // Comprobación
        require(tiketIndex >= 0 && tiketIndex <= 15);
        require(msg.value == 0.02 ether, "Insuficient amount of BNB");

        balanceWei += msg.value;
        bool sucess = true;

        if (tickets[tiketIndex] == address(0)){
            // msg.sender address del usuario que invoco al contrato
            tickets[tiketIndex] = msg.sender;
            emit simpleConsoleLog("Ticket comprado");
        } else {
            sucess = false ;
        }
        return sucess;
    }

    function getTikets() public view returns (address[16] memory) {
        return tickets;
    }
}