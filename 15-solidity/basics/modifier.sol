// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract ModifilerExample {
    address public owner;
    uint256 public value;

    constructor() {
        owner = msg.sender; // Set the contract deployer as the owner
    }

    // Modifiers -> similar to middlewares in express.js
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _; // next() will be executed here
    }

    modifier valueGreaterThanZero(uint256 _value) {
        require(_value > 0, "Value must be greater than zero");
        _;
    }

    function setValue(
        uint256 _value
    ) public onlyOwner valueGreaterThanZero(_value) {
        value = _value; // Only the owner can set the value
    }

    function addValue(
        uint256 _value
    ) public onlyOwner valueGreaterThanZero(_value) {
        value += _value; // Only the owner can add to the value
    }

    function getValue() public view returns (uint256) {
        return value; // Anyone can get the value
    }
}
