// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ADIERC20 is ERC20, Ownable {
    constructor(
        uint256 initialSupply
    ) ERC20("ADI Token", "ADI") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply);
    }
    
    // _mint(address to, uint256 amount);
    // _burn(address account, uint256 amount);
    // transferOwnership(address newOwner);
    // renounceOwnership();
    // transfer(address to, uint256 amount);
    // approve(address spender, uint256 amount);
    // transferFrom(address from, address to, uint256 amount);
    // balanceOf(address account);
    // totalSupply();
    // allowance(address owner, address spender);
    // increaseAllowance(address spender, uint256 addedValue);
    // decreaseAllowance(address spender, uint256 subtractedValue);
    // name();
    // symbol();
    // decimals();
    // version();
}
