// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract EthBridge is Ownable {
    struct BridgeTransaction {
        uint256 amount;
        // uint256 timestamp;
        // bool processed;
    }

    mapping(address => BridgeTransaction) public bridgeTransaction;
    uint256 public totalLocked;
    uint256 public totalMinted;
    IERC20 public token;

    event Minted(address indexed user, uint256 value);
    event Locked(address indexed user, uint256 value);

    constructor(address _tokenAddress) Ownable(msg.sender) {
        token = IERC20(_tokenAddress);
    }

    function lock(uint256 _amount) external {
        // first user will sign approve function on token contract
        require(
            token.transferFrom(msg.sender, address(this), _amount),
            "Allowance Failed"
        );

        bridgeTransaction[msg.sender].amount += _amount;
        totalLocked += _amount;

        emit Locked(msg.sender, _amount);
    }

    function mint(address _to, uint256 _amount) external onlyOwner {
        require(token.transfer(_to, _amount), "Tansfer failed");

        emit Minted(_to, _amount);
    }
}
