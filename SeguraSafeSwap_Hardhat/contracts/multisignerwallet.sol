// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

interface IMultisigWallet {
    function submitTransaction(address destination, uint256 value, bytes calldata data) external returns (uint256);
}

contract MySecureContract {
    address public multisigWallet;

    constructor(address _multisigWallet) {
        multisigWallet = _multisigWallet;
    }

    event ActionExecuted(uint256 indexed transactionId, address indexed target, uint256 value);

    modifier onlyMultisig() {
        require(msg.sender == multisigWallet, "Not authorized");
        _;
    }

    function executeAction(address target, uint256 value, bytes calldata data) external onlyMultisig {
        uint256 transactionId = IMultisigWallet(multisigWallet).submitTransaction(target, value, data);

        // Emitting an event with the transactionId
        emit ActionExecuted(transactionId, target, value);

        // Additional logic can be added here if needed
    }

    // Other functions of the contract

    // Setting the wallet after deployment, use this setter 
    //function setMultisigWallet(address _multisigWallet) public onlyOwner {
    //multisigWallet = _multisigWallet;
    //}
}