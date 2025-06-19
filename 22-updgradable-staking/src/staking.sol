// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Ownable} from "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";

interface IOrca {
    function mint(address _to, uint256 _amount) external;
}

contract Staking is Ownable {
    struct User {
        uint256 stakedAmount;
        uint256 reward;
        uint256 timestamp;
    }
    mapping(address => User) data;
    address private tokenAddress;
    uint256 totalStake;

    constructor() Ownable(msg.sender) {}

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amoount);
    event RewardClaimed(address indexed user, uint256 amount);

    function setTokenAddress(address _tokenAddress) external onlyOwner {
        require(
            address(0) != _tokenAddress,
            "Token Address can be zero address"
        );
        tokenAddress = _tokenAddress;
    }
    // lockTime[msg.sender] = block.timestamp + 1 weeks;
    // 1 Sol => 1 Orca/day
    // 5 sol => 5 Orca/day # yahh something like that !!
    function stake() external payable {
        require(msg.value > 0, "Not a valid payment");
        User storage user = data[msg.sender];

        if (user.stakedAmount > 0) {
            uint256 timeElapse = block.timestamp - user.timestamp;
            user.reward += (user.stakedAmount * timeElapse) / 1 ether / 86400; // seconds in a day
        }

        user.timestamp = block.timestamp;
        user.stakedAmount += msg.value;
        totalStake += msg.value;

        emit Staked(msg.sender, msg.value);
    }

    function unstake(uint256 _amount) external {
        User storage user = data[msg.sender];
        require(user.stakedAmount >= _amount, "Insufficient fund");

        uint256 timeElapse = block.timestamp - user.timestamp;
        user.reward += (user.stakedAmount * timeElapse) / 1 ether / 86400;
        unchecked {
            user.stakedAmount -= _amount;
            totalStake -= _amount;
        }
        if (user.stakedAmount == 0) {
            user.timestamp = 0;
        } else {
            user.timestamp = block.timestamp;
        }
        // payable(msg.sender).transfer(_amount);
        (bool sent,) = msg.sender.call{value: _amount}("");
        require(sent, "Failed to send Ether");
        emit Unstaked(msg.sender, _amount);
    }

    function getReward() external view returns (uint256) {
        require(data[msg.sender].stakedAmount > 0, "No amount is staked");
        uint256 timeElapse = block.timestamp - data[msg.sender].timestamp;
        uint256 tillReward = data[msg.sender].reward +
            ((data[msg.sender].stakedAmount * timeElapse) / 1 ether / 86400);
        return tillReward;
    }

    function claimReward() external {
        User storage user = data[msg.sender];
        require(user.reward > 0, "No rewards to claim");
        if (user.stakedAmount > 0) {
            uint256 timeElapse = block.timestamp - user.timestamp;
            user.reward += (user.stakedAmount * timeElapse) / 1 ether / 86400;
            user.timestamp = block.timestamp;
        }
        uint256 rewardAmount = user.reward;
        user.reward = 0;
        require(tokenAddress != address(0), "Token not configured");
        IOrca(tokenAddress).mint(msg.sender, rewardAmount);
        emit RewardClaimed(msg.sender, rewardAmount);
    }
}
