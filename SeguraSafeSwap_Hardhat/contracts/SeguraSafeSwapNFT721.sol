// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract SeguraSafeSwapNFT721 is Initializable, ContextUpgradeable, ERC721Upgradeable, OwnableUpgradeable {

    function initialize(string memory name, string memory symbol, address initialOwner) public initializer {
        __Context_init();
        __ERC721_init(name, symbol);
        __Ownable_init(initialOwner);
    }

    function safeMint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }

    // Additional functions and logic
}