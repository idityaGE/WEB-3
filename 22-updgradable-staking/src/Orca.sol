// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Ownable} from "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import {ERC20} from "../lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract OrcaToken is ERC20, Ownable {
    constructor(address _contractAddress) ERC20("ORCS", "OrcaToken") Ownable(_contractAddress) {}

    function mint(address _to, uint256 _amount) external onlyOwner() {
        _mint(_to, _amount);
    }
}
