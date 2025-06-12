// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Stake} from "../src/Stake.sol";

contract StakeTest is Test {
    Stake public s;

    constructor() {
        s = new Stake();
    }

    function testStake() public {
        vm.startPrank(address(6969));
        vm.deal(address(6969), 10 ether);
        s.stake{value: 4 ether}();
        vm.stopPrank();
        assert(s.totalStaked() == 4 ether);
    }

    function testUnstake() public {
        vm.startPrank(address(6969));
        vm.deal(address(6969), 10 ether);
        s.stake{value: 4 ether}();

        s.unstake(4 ether);
        vm.stopPrank();
        // vm.expectRevert();
        assert(s.totalStaked() == 0); // removed all the ether from variable
        assert(address(s).balance == 2 ether); // but only sent half 
    }

    
}
