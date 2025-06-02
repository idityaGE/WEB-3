// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract DataLocationExample {
    // STORAGE - persistent on blockchain
    struct User {
        string name;
        uint256 age;
        address wallet;
    }
    
    User[] public users; // Storage array
    mapping(address => User) public userMapping; // Storage mapping
    uint256 public totalUsers; // Storage variable

    // Function demonstrating different data locations
    function addUser(
        string calldata _name,    // CALLDATA - read-only, cheapest
        uint256 _age             // Value type - copied to memory
    ) external {
        // MEMORY - temporary copy for manipulation
        User memory newUser = User({
            name: _name,
            age: _age,
            wallet: msg.sender
        });
        
        // Writing to STORAGE - expensive but persistent
        users.push(newUser);
        userMapping[msg.sender] = newUser;
        totalUsers++;
    }
    
    function getUserInfo(uint256 index) 
        external 
        view 
        returns (User memory) // MEMORY - returning a copy
    {
        require(index < users.length, "Invalid index");
        
        // Reading from STORAGE and returning MEMORY copy
        return users[index];
    }
    
    function updateUserAge(uint256 newAge) external {
        // Direct reference to STORAGE - modifies original
        User storage userRef = userMapping[msg.sender];
        require(bytes(userRef.name).length > 0, "User doesn't exist");
        
        userRef.age = newAge; // Modifies storage directly
    }
    
    function processUserData(
        string[] calldata names,    // CALLDATA - read-only array
        uint256[] memory ages       // MEMORY - can be modified
    ) external pure returns (uint256) {
        require(names.length == ages.length, "Array length mismatch");
        
        uint256 totalAge = 0;
        
        // Can read from calldata
        for (uint256 i = 0; i < names.length; i++) {
            totalAge += ages[i]; // Reading from memory
            // ages[i] = ages[i] + 1; // This would work (memory)
            // names[i] = "modified"; // This would FAIL (calldata is read-only)
        }
        
        return totalAge;
    }
    
    // Demonstrating storage vs memory behavior
    function storageVsMemoryExample() external {
        // Create user in storage
        users.push(User("Alice", 25, address(0x123)));
        
        // STORAGE reference - points to actual storage location
        User storage storageUser = users[users.length - 1];
        storageUser.age = 30; // This modifies the actual storage
        
        // MEMORY copy - creates a separate copy
        User memory memoryUser = users[users.length - 1];
        memoryUser.age = 35; // This only modifies the local copy
        
        // users[users.length - 1].age is now 30, not 35!
    }
}

// Example showing different parameter types
contract ParameterTypes {
    function externalFunction(
        string calldata data1,    // CALLDATA - cheapest for external
        uint256[] memory data2,   // MEMORY - can be modified
        address wallet           // Value type - automatically memory
    ) external pure returns (string memory) {
        // Can read calldata but not modify it
        // Can modify memory data
        data2[0] = 999; // This works
        // data1 = "new value"; // This would fail
        
        return data1; // Returning calldata as memory
    }
    
    function publicFunction(
        string memory data1,      // MEMORY for public functions
        uint256[] memory data2
    ) public pure returns (uint256) {
        // Both parameters are in memory and can be modified
        return data2.length;
    }
}
