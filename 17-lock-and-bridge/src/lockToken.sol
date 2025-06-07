// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LockToken {
    struct LockDetails {
        uint256 lockToken;
        uint256 lockTime;
    }

    IERC20 public token;
    mapping(address => LockDetails) private locker;

    event Deposited(address indexed user, uint256 amount, uint256 unlockTime);
    event Withdrawn(address indexed user, uint256 amount);

    constructor(address _tokenAddress) {
        token = IERC20(_tokenAddress);
    }

    // method overloading
    function deposit(uint256 _value) public {
        deposit(0, _value);
    }

    function deposit(uint256 _time, uint256 _value) public {
        require(
            token.transferFrom(msg.sender, address(this), _value),
            "Transfer failed"
        );
        // update lock time if the given time is greater
        uint256 newLockTime = block.timestamp + _time;
        if (newLockTime > locker[msg.sender].lockTime) {
            locker[msg.sender].lockTime = newLockTime;
        }
        locker[msg.sender].lockToken += _value;
        emit Deposited(msg.sender, _value, locker[msg.sender].lockTime);
    }

    function withdraw(uint256 _value) external {
        LockDetails storage lock = locker[msg.sender];
        require(lock.lockToken >= _value, "Insufficent fund");
        require(lock.lockTime <= block.timestamp, "Token still in lock");
        require(token.transfer(msg.sender, _value), "Transfer failed");
        lock.lockToken -= _value;
        emit Withdrawn(msg.sender, _value);
        if (lock.lockToken == 0) {
            delete locker[msg.sender];
        }
    }

    function getLockDetails(
        address user
    ) external view returns (uint256 amount, uint256 unlockTime) {
        LockDetails memory lock = locker[user];
        return (lock.lockToken, lock.lockTime);
    }
}
