// mera lauda likhe test
// mai jo bhi likha hu mere liye sab sahi h
// [ ] no test requied

// [x] test required
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {LockToken} from "src/lockToken.sol";
import {Test} from "forge-std/Test.sol";
import {USDT} from "src/USDT.sol";

contract TestLockToken is Test {
    LockToken lock;
    USDT u;

    constructor() {
        u = new USDT();
        lock = new LockToken(address(u));
    }

    function testDeposit() public {
        u.mint(address(9999), 1000 * 10 ** 6);

        vm.startPrank(address(9999));
        u.approve(address(lock), 1000 * 10 ** 6);
        lock.deposit(500 * 10 ** 6);
        (uint256 amount, uint256 unlockTime) = lock.getLockDetails(address(9999));
        vm.stopPrank();

        assertEq(amount, 500 * 10 ** 6, "Deposit amount mismatch");
        assertEq(unlockTime, block.timestamp, "Unlock time should be now");
    }

    function testWithdraw() public {
        testDeposit();
        (uint256 amount, uint256 unlockTime) = lock.getLockDetails(address(9999));

        vm.startPrank(address(9999));
        lock.withdraw(500 * 10 ** 6);
        vm.stopPrank();
        (amount, unlockTime) = lock.getLockDetails(address(9999));

        assertEq(amount, 0, "Deposit amount mismatch");
        assertEq(unlockTime, 0, "Unlock time should be now");
    }
}
