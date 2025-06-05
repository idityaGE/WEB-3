// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
// import {console} from "forge-std/console.sol";

contract AdiToken is ERC20, Ownable {
    constructor(uint256 _initSupply) ERC20("Adi Token", "ADI") Ownable(msg.sender) {
        // console.log("Adi Token contract initialized"); // use `-vv` two verbosity
        _mint(msg.sender, _initSupply);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }

    function sendEthToContract() public payable {}

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
