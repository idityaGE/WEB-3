// SPDX-License-Identifier: MIT
// compiler version must be greater than or equal to 0.8.26 and less than 0.9.0
pragma solidity ^0.8.26;

contract HelloWorld {
    // Data Types in Solidity

    // boolean
    bool public isAdult = true;
    
    // uint -> uint256
    // unit8 => 0 to (2^8 - 1)
    uint8 public u8 = 1;
    uint256 public u25 = 456;
    uint public u = 22;

    // int -> uint256
    // int4 => -2^(8-1) to 2^8 - 1
    int8 public i8 = -1;
    int256 public i256 = 43232;

    int256 public INT_MAX = type(int).max;

    address public addr = 0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c;

    // default value when left without assigning value
    bool public defBool; // false
    uint256 public defUint; // 0
    int256 public defInt; // 0
    address public defAddr; // 0x00000000000000000000000..

    // bytes : 
    // fixed size arrays
    // dynamically sized arrays
    bytes1 b = 0xb5; // [10110101]
    bytes1 a = 0x56; // [0101 0110]

    string public name = "Aditya"; // state variable which is saved on the blockchain


    function doSomething() public view {
        // Local Varible are not saved on the blockchain
        uint i = 456;
        uint256 timeStamp = block.timestamp;
        address sender = msg.sender;
    }

    // constant -> value is set at initialization
    address public constant MY_ADDR = 0x777788889999AaAAbBbbCcccddDdeeeEfFFfCcCc;
    uint256 public constant constInt = 69;

    // immutable -> value can be set by construction and can't be changed after words
    address public immutable MYADDR;
    uint256 public immutable myImUint;

    constructor(uint256 _myUint) {
        MYADDR = msg.sender;
        myImUint = _myUint;
    }

    // setter and getter
    uint256 public num;
    function set(uint256 _num) public {
        num = _num;
    }

    // fuction -> 
    function get() public view returns (uint256) {
        return num;
    }

    
    // Visibility
    // type         same contract   derived contract    other contract    external contract
    // public       yes              yes                 yes               yes
    // internal     yes              yes                 no                no
    // external     no               no                  yes               yes
    // private      yes              no                  no                no

    // view -> function does not modify the state of the contract, free to read state variables
    function getName() public view returns (string memory) {
        return name;
    }


}
