// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract Storage {
    //  storage layout
    uint256 public num; 	// 0
    address implementation; // 1
    constructor(address _implementation) {
        num = 0;
        implementation = _implementation;
    }

    function setNum(uint256 _num) public {
        (bool sucess, ) = implementation.delegatecall(
            abi.encodeWithSignature("setNum(uint256)", _num)
        );
        require(sucess, "Error while delegating call");
    }
}

contract Implementation {
    // storage layout
    uint256 public num; // 0

    function setNum(uint256 _num) public {
        num = _num;
    }
}


// [x] CCI Example 

/**
pragma solidity >=0.7.0 <0.9.0;

interface IImplementation {
    function setNum(uint _num) external;
    function num() external view returns (uint);
}

contract Storage {
    uint public num; 
    address public implementation;

    constructor(address _implementation) {
        num = 0;
        implementation = _implementation;
    }

    function setNum(uint _num) public {
        IImplementation(implementation).setNum(_num);
    }
}

contract Implementation {
    uint public num;

    // @dev Sets the `num` in the Implementation contract's own storage.
    function setNum(uint _num) public {
        num = _num;
    }
}
*/
