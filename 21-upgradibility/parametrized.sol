// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract Loon {
    uint256 private amount;
    address public owner;

    struct User {
        uint256 amount;
        uint256 time;
        bool isPaid;
    }

    mapping(address => User) private loadDetails;

    // this value might change on time, insteead of hardcoding this interest rate value
    uint8 public rate; // we will parameterized this value
    // by this way we can achive some level of upgradibilty (to be it's not an upgradibilty)

    constructor() {
        owner = msg.sender;
    }

    function askLoan() external {}
    function getLoan() external {}

    function setRate(uint8 _rate) external {
        require(msg.sender == owner, "Only owner can set rate");
        require(_rate > 0 && _rate <= 100, "Rate must be between 1-100");
        rate = _rate;
    }

    function getInterest() external view returns (uint256) {
        return _calculateInterest(msg.sender);
    }

    function getInterest(address _usr) external view returns (uint256) {
        return _calculateInterest(_usr);
    }

    function _calculateInterest(address _usr) private view returns (uint256) {
        User storage usr = loadDetails[_usr];
        require(usr.amount > 0, "No active loan");
        require(!usr.isPaid, "Loan already paid");
        require(usr.time > 0, "Invalid loan time");
        uint256 timeElapsed = block.timestamp - usr.time;
        // Example: rate = 5 means 5%, calculation: amount * 5 * time / (100 * 365 * 24 * 3600) for annual rate
        uint256 interest = (usr.amount * rate * timeElapsed) / (100 * 365 days);
        return interest;
    }

    function payLoan() external payable {
        User storage usr = loadDetails[msg.sender];
        uint256 totalOwed = usr.amount + _calculateInterest(msg.sender);
        require(msg.value >= totalOwed, "Insufficient payment");
        usr.isPaid = true;
        if (msg.value > totalOwed) {
            payable(msg.sender).transfer(msg.value - totalOwed);
            amount -= msg.value - totalOwed;
        }
    }
}
