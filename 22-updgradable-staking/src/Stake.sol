// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Ownable} from "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";

contract Stake is Ownable {
    struct User {
        uint256 amount;
        uint256 timestamp;
    }
    mapping(address => User) stakes;
    uint256 public totalStaked;

    constructor() Ownable(msg.sender) {
        totalStaked = 0;
    }

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amoount);

    function stake() external payable {
        require(msg.value > 0, "Not a valid payment");
        if (stakes[msg.sender].amount > 0) {
            stakes[msg.sender].amount += msg.value;
        } else {
            stakes[msg.sender] = User({
                amount: msg.value,
                timestamp: block.timestamp
            });
        }
        totalStaked += msg.value;
        emit Staked(msg.sender, msg.value);
    }

    function unstake(uint256 _amount) external returns (uint256 _left) {
        require(_amount > 0, "Invalid amount value");
        require(stakes[msg.sender].amount >= _amount, "Insufficant fund");
        unchecked {
            stakes[msg.sender].amount -= _amount;
        }
        payable(msg.sender).transfer(_amount / 2); // this is buggie contract on purpose 
        totalStaked -= _amount;
        emit Unstaked(msg.sender, _amount);
        return stakes[msg.sender].amount;
    }

    function stakedAmount(address _user) public view returns (uint256 amount) {
        require(stakes[_user].amount > 0, "There is no user with this address");
        return stakes[_user].amount;
    }
}
