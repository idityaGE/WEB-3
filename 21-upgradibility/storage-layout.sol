// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

// import {} from "@openzapllin/";

contract StorageProxy is Ownable {
    // address private _owner // 0
    uint public num;          // 1
    address implementation;   // 2

    constructor(address _implementation) Ownable(msg.sender) {
        num = 0;
        implementation = _implementation;
    }

    function setNum(uint _num) public {
        (bool success, ) = implementation.delegatecall(
            abi.encodeWithSignature("setNum(uint256)", _num)
        );
        require(success, "Error while delegating call");
    }

    function setImplementation(address _implementation) public onlyOwner {
        implementation = _implementation;
    }
}

// Naive Solution (add a dummy variable )

contract Implementationv2 {
    uint public _dummy; // 0
    uint public num;    // 1

    function setNum(uint _num) public {
        num = _num * 2;
    }
}
