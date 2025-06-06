// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract LockEth {
    struct lockDetails {
        uint256 lockTime;
        uint256 lockAmount;
    }
    mapping(address => lockDetails) private locker;

    event Deposit(address indexed _address, uint256 _amount, uint256 _time);
    event Withdrwal(address indexed _address, uint256 _amount);

    function deposit() public payable {
        deposit(0);
    }

    function deposit(uint256 _time) public payable {
        require(_time >= 0, "Invalid Time");

        uint256 newLockTime = block.timestamp + _time;
        if (newLockTime > locker[msg.sender].lockTime) {
            locker[msg.sender].lockTime = newLockTime;
        }

        locker[msg.sender].lockAmount += msg.value;
        emit Deposit(msg.sender, msg.value, _time);
    }

    function checkLock() public view returns (uint256 _amount, uint256 _time) {
        return (locker[msg.sender].lockAmount, locker[msg.sender].lockTime);
    }

    function withdrawal(uint256 _amount) public {
        require(
            block.timestamp > locker[msg.sender].lockTime,
            "Time Limit has not met yet"
        );
        require(
            locker[msg.sender].lockAmount >= _amount,
            "Invalid amount parameter"
        );
        locker[msg.sender].lockAmount -= _amount;
        payable(msg.sender).transfer(_amount);

        emit Withdrwal(msg.sender, _amount);

        if (locker[msg.sender].lockAmount == 0) {
            delete locker[msg.sender];
        }
    }
}
