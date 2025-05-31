// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.26;

contract Calculator {
    int256 public result;

    constructor() {
        result = 0;
    }

    function add(int256 _val) public {
        result += _val;
    }

    function sub(int256 _val) public {
        result -= _val;
    }

    function mul(int256 _val) public {
        result *= _val;
    }

    function div(int256 _val) public {
        // if(_val == 0) {
        //     revert("Division by zero is not allowed");
        // }

        // require -> 
        require(_val != 0, "Division by zero is not allowed");
        result /= _val;
    }

    function get() public view returns (int) {
        return result;
    }
}
