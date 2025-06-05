// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AdiToken is ERC20, Ownable {
    constructor(
        uint256 _initSupply
    ) ERC20("Adi Token", "ADI") Ownable(msg.sender) {
        _mint(msg.sender, _initSupply);
    }
}
