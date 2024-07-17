pragma solidity ^0.8.10;

contract MyContract {
    address[16] public tickets;
    function buyTiket(uint tiketIndex) public returns (bool) {
        // Comprobación
        require(tiketIndex >= 0 && tiketIndex <= 15);
        bool sucess = true;

        if (tickets[tiketIndex] == address(0)){
            // msg.sender address del usuario que invoco al contrato
            tickets[tiketIndex] = msg.sender;
        } else {
            sucess = false ;
        }
        return sucess;
    }

    function getTikets() public view returns (address[16] memory) {
        return tickets;
    }
}