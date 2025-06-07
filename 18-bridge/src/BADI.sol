// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract BADI is ERC20, Ownable {
    constructor() ERC20("Bridge ADI Token", "BADI") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function mint(
        address to,
        uint256 amount
    ) external onlyOwner returns (bool) {
        _mint(to, amount);
        return true;
    }

    function burn(uint256 amount) external returns (bool) {
        _burn(msg.sender, amount);
        return true;
    }
}
