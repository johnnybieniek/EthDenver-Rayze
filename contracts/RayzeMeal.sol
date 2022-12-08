// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title RayzeMeal - Tokenized meals which are redeemable
/// @author Jamshed Cooper, Jan Biebiek
/// @dev An NFT contract that represents a meal. The collection size represents the # of meals that can be redeemable.
/// @dev Each NFT has meal info as well as a price in MealCoin
/// @dev Eaters collect the meal NFTs and redeem them for meals

contract RayzeMeal is ERC721, Pausable, Ownable, ERC721Burnable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

/// @dev The following public variables describe this RayzeMeal NFT

/// @dev The URI images for IPFS
  string public uriPrefix; // = "ipfs://QmWC6NEbHNrAWy8x6BzR2rnWpkjzoVMrKxXgRxSpqNTgFh/";
  string public uriSuffix = ".json";

/// @dev The pricing details & total supply
  uint256 public cost;
  uint256 public maxSupply;

/// @dev The Restaurant & Meal information
  string public restaurantName;
  string public pickupLocation;
  string public ingredients;
  string public nutrition;
  uint256 public origCost;

/// @notice Events
    event Minted(uint256 value);

/// @notice Modifiers - Ensure that we do not exceed mint supply params
    modifier mintCompliance(uint256 _mintAmount) {
        require(_tokenIdCounter.current() + _mintAmount <= maxSupply, "Max supply exceeded!");
        _;
    }

    constructor() ERC721("RayzeMeal", "RML") {}

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

/// @notice - Total supply of NFTs minted
  function totalSupply() public view returns (uint256) {
    return _tokenIdCounter.current();
  }
}