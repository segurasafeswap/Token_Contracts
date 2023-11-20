// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

abstract contract BaseERC1155NFT is Initializable, ERC1155Upgradeable, OwnableUpgradeable {
    function initializeBaseERC1155(string memory uri, address initialOwner) internal initializer {
        __ERC1155_init(uri);
        __Ownable_init();
        _transferOwnership(initialOwner);
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data) public virtual onlyOwner {
        _mint(account, id, amount, data);
    }

    function burn(address account, uint256 id, uint256 amount) public virtual onlyOwner {
        _burn(account, id, amount);
    }
}
