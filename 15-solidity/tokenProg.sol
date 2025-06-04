// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract TokenContract {
    uint256 public SUPPLY;
    address private immutable owner;
    mapping(address => uint256) private mp;
    mapping(address => mapping(address => uint256)) allowances;
    string public constant name = "Adii Coin";
    string public constant symbol = "ADI";

    event Mint(address indexed to, uint256 amount);
    event Transfer(address indexed _from, address indexed _to, uint256 _amount);
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _amount
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier validTransfer(uint256 _amount, address _user) {
        require(_amount > 0, "Not valid amount");
        require(mp[_user] >= _amount, "Insuffient fund");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function mintToken(uint256 _amount) public onlyOwner {
        require(_amount > 0, "Amount must be greater than 0");
        SUPPLY += _amount;
        mp[owner] += _amount;
        emit Mint(owner, _amount);
    }

    // Owner can use this to send token
    function sendToken(
        address _to,
        uint256 _amount
    ) public validTransfer(_amount, msg.sender) {
        require(_to != address(0), "Cannot send to zero address");
        mp[msg.sender] -= _amount;
        mp[_to] += _amount;
        emit Transfer(msg.sender, _to, _amount);
    }

    function viewBalance() public view returns (uint256) {
        return mp[msg.sender];
    }

    function setAllowance(
        address _to,
        uint256 _allowance
    ) public validTransfer(_allowance, msg.sender) {
        require(_to != address(0), "Cannot set to zero address");
        allowances[msg.sender][_to] = _allowance;
        emit Approval(msg.sender, _to, _allowance);
    }

    function getAllowance(
        address _from,
        address _to,
        uint256 _amount
    ) public validTransfer(_amount, _from) {
        require(_from != address(0) && _to != address(0), "Give valid address");
        require(
            allowances[_from][msg.sender] >= _amount,
            "Insuffient allowance"
        );
        allowances[_from][msg.sender] -= _amount;
        mp[_from] -= _amount;
        mp[_to] += _amount;
    }
}
