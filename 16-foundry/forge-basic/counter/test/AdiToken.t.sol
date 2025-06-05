// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {AdiToken} from "../src/AdiToken.sol";

contract AdiTokenTest is Test {
    AdiToken private c;

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
        assertEq(
            balanceAfter,
            balanceBefore + 500,
            "Owner's balance should increase by 500"
        );
    }

    function testBurning() public {
        address owner = c.owner();
        uint256 balanceBefore = c.balanceOf(owner);

        c.burn(owner, 200);

        uint256 balanceAfter = c.balanceOf(owner);
        assertEq(
            balanceAfter,
            balanceBefore - 200,
            "Owner's balance should decrease by 200"
        );
    }

    function testRenounceOwnership() public {
        c.renounceOwnership();
        assertEq(address(0), c.owner());
    }

    function testTransfer() public {
        uint256 balanceBefore = c.balanceOf(address(this));
        c.transfer(address(1137), 50);
        uint256 balanceAfter = c.balanceOf(address(this));
        console.log(balanceAfter);
        assertEq(balanceAfter, balanceBefore - 50);
    }
}
