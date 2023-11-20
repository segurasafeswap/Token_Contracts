// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

abstract contract BaseERC721NFT is Initializable, ERC721Upgradeable, OwnableUpgradeable {
    function initialize(string memory name, string memory symbol, address _initialOwner) public initializer {
        __ERC721_init(name, symbol);
        __Ownable_init();
        transferOwnership(_initialOwner);
    }

    function safeMint(address to, uint256 tokenId) public virtual onlyOwner {
        _safeMint(to, tokenId);
    }
}
