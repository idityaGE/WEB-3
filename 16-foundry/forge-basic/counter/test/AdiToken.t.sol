// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {AdiToken} from "../src/AdiToken.sol";

// try `forge test -vvvv`
// no. of v means level of verbosity

contract AdiTokenTest is Test {
    AdiToken private c;

    event Transfer(address indexed from, address indexed to, uint256 value);

    function setUp() public {
        c = new AdiToken(1000); // Initialize with 1000 tokens
    }

    function testOwner() public view {
        // address(this) => is the owner because, it deploys the contract
        assertEq(address(this), c.owner());
    }

    function testInitialSupply() public view {
        uint256 initialSupply = c.totalSupply();
        assertEq(initialSupply, 1000, "Initial supply should be 1000");
    }

    function testMinting() public {
        address owner = c.owner();
        uint256 balanceBefore = c.balanceOf(owner);

        c.mint(owner, 500);

        uint256 balanceAfter = c.balanceOf(owner);
        assertEq(balanceAfter, balanceBefore + 500, "Owner's balance should increase by 500");

        vm.prank(address(1137)); // next call will be called by address(1137)
        vm.expectRevert();
        c.mint(address(1198), 5000); // this will be called by address(1137)

        // now this will be called by address(this), which owner
        c.mint(owner, 200);
        assertEq(c.balanceOf(owner), 1700);
    }

    function testBurning() public {
        address owner = c.owner();
        uint256 balanceBefore = c.balanceOf(owner);

        c.burn(owner, 200);

        uint256 balanceAfter = c.balanceOf(owner);
        assertEq(balanceAfter, balanceBefore - 200, "Owner's balance should decrease by 200");
    }

    function testRenounceOwnership() public {
        c.renounceOwnership();
        assertEq(address(0), c.owner());
    }

    function testTransfer() public {
        uint256 balanceBefore = c.balanceOf(address(this));

        // 1. Setup the expectation
        vm.expectEmit(true, true, true, true);
        // 2. Emit the expected event manually
        emit Transfer(address(this), address(1137), 50);
        // 3. Call the function that should emit the event
        c.transfer(address(1137), 50);

        uint256 balanceAfter = c.balanceOf(address(this));
        console.logUint(balanceAfter);
        assertEq(balanceAfter, balanceBefore - 50);
        assertEq(c.balanceOf(address(1137)), 50);

        vm.prank(address(1137));
        c.transfer(address(this), 40);

        assertEq(c.balanceOf(address(1137)), 10);
    }

    function testAllownace() public {
        address spender = address(1137);
        address payer = address(this);
        c.approve(spender, 200);
        uint256 allowance = c.allowance(payer, spender);
        assertEq(allowance, 200);

        vm.prank(spender);
        c.transferFrom(payer, address(1192), 150);

        assertEq(c.balanceOf(payer), 1000 - 150);
        assertEq(c.balanceOf(address(1192)), 150);
    }

    function testDeal() public {
        vm.deal(address(this), 10 ether);
        assertEq(address(this).balance, 10 ether);
    }

    function testHoax() public {
        hoax(address(9990), 10 ether);
        c.sendEthToContract{value: 5 ether}(); // sending ether to a payable function
        assertEq(c.getBalance(), 5 ether);
    }

    /**
     * #=== Prank ===#
     * vm.prank(msgSender); only for one next transtion
     * // transaction 1
     *
     * vm.startPrank(msgSender);
     * // transaction 1
     * // transaction 2
     * vm.stopPrank();
     *
     *
     * #=== Deal ===#
     * vm.deal(account, newBalance);
     * // set the balance of this `account` to `newBalance`; eg. ->
     * vm.deal(address(this), 10 ether);
     *
     * #=== Hoax ===#
     * // combinaion of deal and prank
     * hoax(address msgSender, uint256 give);
     * // internally
     * function hoax(address msgSender, uint256 give) internal virtual {
     *     vm.deal(msgSender, give);
     *     vm.prank(msgSender);
     * }
     */
}
