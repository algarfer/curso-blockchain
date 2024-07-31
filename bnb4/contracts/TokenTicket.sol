// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.10;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenTicket is ERC721 {
    // direción del minter, cartera que puede iniciar la generación de nuevos tokens
    address public minter;
    address public admin;

    struct Informacion  {
        string nombreConcierto;
        string fechaConcierto;
    }

    mapping(uint256 => Informacion) private tokenInformacion;

    constructor() payable ERC721("TiketNFT", "TiketNFT") {
        // asignación del minter inicial
        minter = msg.sender;
        admin = msg.sender;
    }

    function mint(address account, uint256 tokenId) public {
        require(msg.sender == minter, 'Error, msg.sender is not the minter');
        _mint(account, tokenId);
    }

    function mintConInfo(address account, uint256 tokenId, string memory nombreConcierto, string memory fechaConcierto) public  {
        mint(account, tokenId);
        tokenInformacion[tokenId] = Informacion(nombreConcierto, fechaConcierto);
    }

    function passMinterRole(address nuevoMinter) public {
        require(msg.sender == minter || msg.sender == admin, "You are not the admin or the minter");
        minter = nuevoMinter;
    }

}
