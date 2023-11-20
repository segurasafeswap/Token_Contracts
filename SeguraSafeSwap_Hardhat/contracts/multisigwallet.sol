// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

contract MultisigWallet {
    address[] public signers; // Array of signers' addresses
    uint public requiredSignatures;

    // Define a structure to hold transaction data
    struct Transaction {
        address to;
        uint value;
        bytes data;
        bool executed;
    }

    // List of proposed transactions
    Transaction[] public transactions;

    // Mapping from transaction ID to wallet address to approval status
    mapping(uint => mapping(address => bool)) public approvals;

    constructor(address[] memory _signers, uint _requiredSignatures) {
        signers = _signers;
        requiredSignatures = _requiredSignatures;
    }

    modifier onlySigner() {
        require(isSigner(msg.sender), "Not authorized");
        _;
    }

    function isSigner(address _address) public view returns(bool) {
        for (uint i = 0; i < signers.length; i++) {
            if (signers[i] == _address) {
                return true;
            }
        }
        return false;
    }

    function proposeTransaction(address _to, uint _value, bytes memory _data) public onlySigner {
        transactions.push(Transaction({
            to: _to,
            value: _value,
            data: _data,
            executed: false
        }));
    }

    function approveTransaction(uint _txIndex) public onlySigner {
        Transaction storage transaction = transactions[_txIndex];

        require(!transaction.executed, "Transaction already executed");
        require(!approvals[_txIndex][msg.sender], "Transaction already approved");

        approvals[_txIndex][msg.sender] = true;
    }

    function executeTransaction(uint _txIndex) public onlySigner {
        Transaction storage transaction = transactions[_txIndex];
        require(!transaction.executed, "Transaction already executed");
        
        uint approvalCount = 0;
        for (uint i = 0; i < signers.length; i++) {
            if (approvals[_txIndex][signers[i]]) {
                approvalCount++;
            }
        }

        require(approvalCount >= requiredSignatures, "Insufficient approvals");

        transaction.executed = true;
        (bool success, ) = transaction.to.call{value: transaction.value}(transaction.data);
        require(success, "Transaction execution failed");
    }

    function revokeApproval(uint _txIndex) public onlySigner {
        Transaction storage transaction = transactions[_txIndex];

        require(!transaction.executed, "Transaction already executed");
        require(approvals[_txIndex][msg.sender], "Transaction not approved");

        approvals[_txIndex][msg.sender] = false;
    }

    // Function to deposit Ether into the contract
    receive() external payable {}

    // Function to check the balance of the contract
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}