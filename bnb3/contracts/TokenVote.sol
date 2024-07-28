// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenVote is ERC20 {
    uint256 public maximunSupply = 10 ether;

    // direción del minter, cartera que puede iniciar la generación de nuevos tokens
    address public minter;
    address public admin;

    constructor() payable ERC20("VotaToken", "VOTA") {
        // asignación del minter inicial
        minter = msg.sender;
        admin = msg.sender;
    }

    function mint(address account, uint256 amount) public {
        require(msg.sender == minter, 'Error, msg.sender is not the minter');
        require(totalSupply() < maximunSupply, "Error, minting exceeds the maximum supply");
        if ( totalSupply() + amount <= maximunSupply){
            _mint(account, amount);
        } else {
            if (totalSupply() - amount > 0){
                _mint(account, totalSupply() - amount);
            }
        }
    }

    function passMinterRole(address nuevoMinter) public returns (bool) {
        // restriccion que se tiene que cumplir
        require(msg.sender == minter || msg.sender == admin, 'Error, msg.sender is not the minter');
        minter = nuevoMinter;
        return true;
    }

    function changeAdmin(address _admin) public {
        require(msg.sender == admin, "Error, you are not an admin");
        admin = _admin;
    }

    function transfer(address recipient, uint256 amount) public virtual override returns (bool) {
        require(msg.sender == minter, "Only the minterRole can transfer ");
        return super.transfer(recipient, amount);
    }

    function transferFrom(address sender, address recipient, uint256 amount) public virtual override returns (bool) {
        require(sender == minter, "Only the minterRole can transfer tokens ");
        return super.transferFrom(sender, recipient, amount);
    }

}

