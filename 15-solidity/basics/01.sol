// SPDX-License-Identifier: MIT
// compiler version must be greater than or equal to 0.8.26 and less than 0.9.0
pragma solidity ^0.8.26;

contract HelloWorld {
    // Data Types in Solidity

    // boolean
    bool public isAdult = true;

    // uint -> uint256
    // unit8 => 0 to (2^8 - 1)
    uint8 public u8 = 1;
    uint256 public u25 = 456;
    uint public u = 22;

    // int -> uint256
    // int4 => -2^(8-1) to 2^8 - 1
    int8 public i8 = -1;
    int256 public i256 = 43232;

    int256 public INT_MAX = type(int).max;

    address public addr = 0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c;

    // default value when left without assigning value
    bool public defBool; // false
    uint256 public defUint; // 0
    int256 public defInt; // 0
    address public defAddr; // 0x00000000000000000000000..

    // bytes :
    // fixed size arrays
    // dynamically sized arrays
    bytes1 b = 0xb5; // [10110101]
    bytes1 a = 0x56; // [0101 0110]

    string public name = "Aditya"; // state variable which is saved on the blockchain

    function doSomething() public view returns (uint, uint256, address) {
        // Local Varible are not saved on the blockchain
        uint i = 456;
        uint256 timeStamp = block.timestamp;
        address sender = msg.sender;
        return (i, timeStamp, sender);
    }

    // constant -> value is set at initialization
    address public constant MY_ADDR =
        0x777788889999AaAAbBbbCcccddDdeeeEfFFfCcCc;
    uint256 public constant constInt = 69;

    // immutable -> value can be set by construction and can't be changed after words
    address public immutable MYADDR;
    uint256 public immutable myImUint;

    constructor(uint256 _myUint) {
        MYADDR = msg.sender;
        myImUint = _myUint;
    }

    // setter and getter
    uint256 public num;

    function set(uint256 _num) public {
        num = _num;
    }

    // fuction ->
    function get() public view returns (uint256) {
        return num;
    }

    // Visibility
    // type         same contract   derived contract    other contract    external contract
    // public       yes              yes                 yes               yes
    // internal     yes              yes                 no                no
    // external     no               no                  yes               yes
    // private      yes              no                  no                no

    // view -> function does not modify the state of the contract, free to read state variables
    function getName() public view returns (string memory) {
        return name;
    }

    // struct -> user defined data type
    struct User {
        string name;
        uint256 age;
        address addr;
    }
    User public user = User("Alice", 30, 0x1234567890123456789012345678901234567890);
    // User public user2 = User({name: "Bob", age: 25, addr: 0x0987654321098765432109876543210987654321});


    // Array 
    string[] public names; // dynamic array of strings
    uint256[5] public fixedArray = [1, 2, 3, 4, 5]; // fixed size array of uint256
    User[] public users; // dynamic array of User structs
    // users.length; // get the length of the users array
    // users[0]; // get the first user in the users array
    // users.push(User("Alice", 30, 0x1234567890123456789012345678901234567890)); // add a new user to the users array
    // users.pop(); // remove the last user from the users array

    // Mapping -> key-value pair
    mapping(address => User) public userMapping; // mapping from address to User struct
    mapping(address => uint256) public balanceOf; // mapping from address to uint256 (balance)
    mapping(string => mapping(address => uint256)) public tokenBalances; // mapping from token name to mapping of address to balance
    // userMapping[msg.sender] = User("Bob", 25, msg.sender); // set a user in the userMapping
    // delete userMapping[msg.sender]; // delete a user from the userMapping

    // Enum -> user defined data type with a finite set of values
    enum Status {
        Active,
        Inactive,
        Suspended
    }
    Status public status; // default value is Active (0)
    // status = Status.Inactive; // set the status to Inactive

    // Error Handling
    error InsufficientBalance(uint256 requested, uint256 available);
    function withdraw(uint256 amount) public {
        uint256 balance = balanceOf[msg.sender];
        if (amount > balance) {
            revert InsufficientBalance(amount, balance);
        }
        balanceOf[msg.sender] -= amount;
        // transfer logic here
    }

    // Events -> used to log information on the blockchain
    event UserCreated(string name, uint256 age, address addr);
    function createUser(string memory _name, uint256 _age) public {
        User memory newUser = User(_name, _age, msg.sender);
        users.push(newUser);
        emit UserCreated(_name, _age, msg.sender); // emit the event
    }

    // Memory types
    // memory -> temporary storage, only exists during the execution of the function
    // storage -> permanent storage, exists on the blockchain
    // calldata (stack) -> read-only data, used for function parameters
    
}
