// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

// Proxy Contract
contract StorageProxy {
    uint public num;
    address public owner;
    address implementation;

    constructor(address _implementation) {
        owner = msg.sender;
        num = 0;
        implementation = _implementation;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    // You have to specify all functions upfront when the Proxy contract is being deployed.
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

// #=== Implementation [logic] Contract ===#
contract Implementationv1 {
    uint public num;

    function setNum(uint _num) public {
        num = _num;
    }
}

contract Implementationv2 {
    uint public num;

    function setNum(uint _num) public {
        num = _num * 2;
    }
}

contract Implementationv3 {
    uint public num;

    function setNum(uint _num) public {
        num = _num * 3;
    }
}
