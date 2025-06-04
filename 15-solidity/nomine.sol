// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract Nominee {
    address private owner;
    uint256 private amount;
    address private nominee;
    uint256 private lastDateOfPing; // if not pinged for 1 year, nominee becomes owner

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier onlyNominee() {
        require(
            msg.sender == nominee,
            "Only the nominee can call this function"
        );
        _;
    }

    function deposit() external payable onlyOwner {
        require(msg.value > 0, "Deposit amount must be greater than zero");
        amount += msg.value;
    }

    function withdraw(uint256 _amount) external onlyOwner {
        require(amount > 0, "No funds to withdraw");
        require(_amount <= amount && _amount > 0, "Invalid withdrawal amount");
        amount -= _amount;
        payable(owner).transfer(_amount);
    }

    function ping() external onlyOwner {
        lastDateOfPing = block.timestamp; // ref: https://solidity-by-example.org/variables/
    }

    function setNominee(address _nominee) external onlyOwner {
        require(_nominee != address(0), "Nominee address cannot be zero");
        nominee = _nominee;
    }

    function getNominee() external view onlyOwner returns (address) {
        return nominee;
    }

    function getLastDateOfPing() external view onlyOwner returns (uint256) {
        return lastDateOfPing;
    }

    function getAmount() external view onlyOwner returns (uint256) {
        return amount;
    }

    function nomineeWithdraw(uint256 _amount) public onlyNominee {
        require(
            block.timestamp - lastDateOfPing > 365 days,
            "Nominee cannot withdraw yet"
        );
        require(_amount <= amount && _amount > 0, "Invalid withdrawal amount");

        amount -= _amount;
        payable(nominee).transfer(_amount);
    }
}
