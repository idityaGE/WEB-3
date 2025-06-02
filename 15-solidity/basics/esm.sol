// SPDX-License-Identifier: MIT

pragma solidity ^0.8.26;

contract ESM {
    struct User {
        string name;
        uint8 age;
    }

    mapping(address => User) userMap;
    mapping(string => address) revMap;

    function getUser() public view returns (User memory) {
        if (bytes(userMap[msg.sender].name).length == 0) {
            revert("user doesn't exist");
        }
        User memory user = userMap[msg.sender];
        return user;
    }

    function addUser(string memory _name, uint8 _age) public {
        if (revMap[_name] == msg.sender) {
            revert("user already exits");
        }
        userMap[msg.sender] = User(_name, _age);
        revMap[_name] = msg.sender;
    }

    function removeUser() public {
        delete revMap[userMap[msg.sender].name];
        delete userMap[msg.sender];
    }

    function getUserByName(string memory _name) public view returns (User memory) {
        if (revMap[_name] == address(0)) {
            revert("user doesn't exist with this name");
        }
        return userMap[revMap[_name]];
    }
}
