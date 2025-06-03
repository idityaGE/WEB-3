// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IStorage {
    function setNumber(uint256 _number) external;

    function getNumber() external view returns (uint256);
}

// Cross Contract Interaction (CCI) : 
// This contract interacts with another contract that implements the IStorage interface.
contract CCI {
    address private contractAddr;

    constructor(address _contractAddr) {
        contractAddr = _contractAddr;
    }

    function proxySetNumber(uint256 _number) public {
        IStorage(contractAddr).setNumber(_number);
    }

    function proxyGetNumber() public view returns (uint256) {
        return IStorage(contractAddr).getNumber();
    }
}
