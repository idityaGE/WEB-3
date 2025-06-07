// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract EthBridge is Ownable {
    IERC20 public token;

    event LockedADI(address indexed user, uint256 value);

    constructor(address _tokenAddress) Ownable(msg.sender) {
        token = IERC20(_tokenAddress);
    }

    function lockADI(uint256 _amount) external {
        require(token.transferFrom(msg.sender, address(this), _amount), "Allowance Failed");
        emit LockedADI(msg.sender, _amount);
    }

    function mintADI(address _to, uint256 _amount) external onlyOwner() {
        require(token.transfer(_to, _amount), "Tansfer failed");
    }
}
