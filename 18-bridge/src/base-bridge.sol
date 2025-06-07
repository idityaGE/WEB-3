// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {BADI} from "./BADI.sol";

contract BaseBridge is Ownable {
    BADI private btok;

    event BurnADI(address indexed user, uint256 value);

    constructor() Ownable(msg.sender) {
        btok = new BADI();
    }

    function burnADI(uint256 _amount) external {
        require(
            btok.transferFrom(msg.sender, address(this), _amount),
            "Allowance Failed"
        );
        btok.burn(_amount);
        emit BurnADI(msg.sender, _amount);
    }

    function mintADI(address _to, uint256 _amount) external onlyOwner {
        require(btok.mint(_to, _amount), "Minting Failed");
    }
}
