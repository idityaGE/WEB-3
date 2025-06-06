// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {AdiToken} from "../src/AdiToken.sol";

contract CounterScript is Script {
    AdiToken public token;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        token = new AdiToken(1000 * 10 ** 18); // Initialize with 1000 tokens, considering decimals

        vm.stopBroadcast();
    }
}
