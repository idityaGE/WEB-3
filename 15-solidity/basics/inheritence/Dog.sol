pragma solidity ^0.8.26;
import "./Animal.sol";

contract Dog is Animal {
    string public breed;

    constructor(
        string memory _name,
        string memory _species,
        uint8 _age,
        string memory _breed
    ) Animal(_name, _species, _age) {
        breed = _breed;
    }

    // Override the Sleep function from the Animal contract
    function speak() public pure override returns (string memory) {
        return "Woof";
    }
    
    // Add a new function to get additional dog info including breed
    function getDogInfo() public view returns (string memory, string memory, uint8, string memory) {
        (string memory name, string memory species, uint8 age) = getInfo();
        return (name, species, age, breed);
    }
}


