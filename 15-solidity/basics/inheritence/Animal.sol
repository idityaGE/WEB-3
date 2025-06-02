contract Animal {
    string public name;
    string public species;
    uint8 public age;

    constructor(string memory _name, string memory _species, uint8 _age) {
        name = _name;
        species = _species;
        age = _age;
    }

    // virtual -> function can be overridden in derived contracts
    function getInfo()
        public
        view
        virtual
        returns (string memory, string memory, uint8)
    {
        return (name, species, age);
    }

    // pure -> function does not read or modify the state of the contract
    function speak() public pure virtual returns (string memory) {
        return "Animal sound";
    }
}
