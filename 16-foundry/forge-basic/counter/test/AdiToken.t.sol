// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {AdiToken} from "../src/AdiToken.sol";

contract AdiTokenTest is Test {
    AdiToken private c;

    function setUp() public {
        c = new AdiToken(1000); // Initialize with 1000 tokens
    }
    
    function testInitialSupply() public view {
        uint256 initialSupply = c.totalSupply();
        assertEq(initialSupply, 1000, "Initial supply should be 1000");
    }

    
}
