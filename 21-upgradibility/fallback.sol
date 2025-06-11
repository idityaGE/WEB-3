// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract FundReceiver {
    event FallbackCalled();

    fallback() external payable {
        emit FallbackCalled();
    }
}


// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/proxy/Proxy.sol

contract Proxy {
    address public implementation;

    constructor(address _implementation) {
        implementation = _implementation;
    }

    receive() external payable {
        // Forward the plain ETH transfers to the implementation contract
        (bool success, ) = implementation.delegatecall("");
        require(success, "Delegatecall failed");
    }

    fallback() external payable {
        // Forward the call to the implementation contract
        // cd16ecbf => setNum(uint256) [using keccak-256 hash] and args followed by 32 bits
        // 0xcd16ecbf0000000000000000000000000000000000000000000000000000000000000002
        (bool success, ) = implementation.delegatecall(msg.data);
        require(success, "Delegatecall failed");
    }
}

contract ImplementationV1 {
    uint public num;
    address public implementation;

    function setNum(uint _num) public {
        num = _num;
    }
}
