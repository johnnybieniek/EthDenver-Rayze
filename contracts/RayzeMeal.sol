// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title RayzeMeal - Tokenized meals which are redeemable
/// @author Jamshed Cooper, Jan Bieniek
/// @dev An NFT contract that represents a meal. The collection size represents the # of meals that can be redeemable.
/// @dev Each NFT has meal info as well as a price in MealCoin
/// @dev Eaters collect the meal NFTs and redeem them for meals

contract RayzeMeal is ERC721, Pausable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

/// @dev The following public variables describe this RayzeMeal NFT

/// @dev The URI images for IPFS
    string public uriPrefix = "ipfs://QmWC6NEbHNrAWy8x6BzR2rnWpkjzoVMrKxXgRxSpqNTgFh/";
    string public uriSuffix = ".json";

/// @dev The pricing details & total supply & redeemFlags
    uint256 public cost;
    address public restaurantOwner;
    uint256 public maxSupply;
    bool[] public isRedeemed;


/// @dev The Meal information
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

    constructor(string memory _name, string memory _symbol, uint256 _cost, string memory _uriPrefix, address _restaurantOwner) ERC721(_name, _symbol) {
        restaurantOwner = _restaurantOwner;
        cost = _cost;
        uriPrefix = _uriPrefix;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function safeMint(address to) public onlyOwner whenNotPaused {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        isRedeemed[tokenId] = false;
        
        emit Minted(1);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

/// @dev mints for a specific address. Calls _addPayee to manage the TokenSplitting
    function mintForAddress(uint256 _mintAmount, address _receiver) public onlyOwner whenNotPaused {
        _mintLoop(_receiver, _mintAmount);
        emit Minted(_mintAmount);
    }

/// @dev main mint loop function
    function _mintLoop(address _receiver, uint256 _mintAmount) internal {

        for (uint256 i = 0; i < _mintAmount; i++) {
        _tokenIdCounter.increment();
        _safeMint(_receiver, _tokenIdCounter.current());
        isRedeemed[_tokenIdCounter.current()] = false;
        }
    }

/// @notice - Total supply of NFTs minted
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

// /// @dev given a wallet address - returns the array of NFT token-ids owned by a wallet
//     function walletOfOwner(address _owner) public view returns (uint256[] memory) {
//         uint256 ownerTokenCount = balanceOf(_owner);
//         uint256[] memory ownedTokenIds = new uint256[](ownerTokenCount);
//         uint256 currentTokenId = 1;
//         uint256 ownedTokenIndex = 0;
//         uint256 maxSup = _tokenIdCounter.current();

//         while (ownedTokenIndex < ownerTokenCount && currentTokenId <= maxSup) {
//             address currentTokenOwner = ownerOf(currentTokenId);
//             if (currentTokenOwner == _owner) {
//                 ownedTokenIds[ownedTokenIndex] = currentTokenId;

//                 ownedTokenIndex++;
//             }
//             currentTokenId++;
//         }
//         return ownedTokenIds;
//     }

/// @dev returns the NFT Holders wallet address given a token Id
    function tokenOwnerAddress(uint256 _tokenId) public view returns (address) {
        require(_tokenId <= _tokenIdCounter.current(), "TokenId > max supply");
        return ownerOf(_tokenId);
    }

/// @dev returns the balance of the value in the contract
    function balanceValue() public view returns (uint256) {
        //console.log("--------bal is------- ",address(this).balance);
        return address(this).balance;
    }

/// @dev set the cost
    function setCost(uint256 _cost) public onlyOwner whenNotPaused {
        cost = _cost;
    }

/// @dev set the info for the meal
    function setMealInfo(string memory _ingredients, string memory _nutrition, uint256 _origCost) public onlyOwner whenNotPaused {
        ingredients = _ingredients;
        nutrition = _nutrition;
        origCost = _origCost;
    }

/// @dev withdraws funds to owners address
    function withdraw() public onlyOwner whenNotPaused {
        // Transfer 3% to Rayze
        (bool hs, ) = payable(0xA1cAd9f755E3fbD16cDcd13bA362905c3390E4B0).call{
            value: (address(this).balance * 3) / 100
        }("");
        require(hs);
    }

// /// @dev redeem the meal with ix index of the NFT owned by the owner of the NFT(i)
//     function redeemMeal(uint256 ix) public onlyOwner whenNotPaused{
//         require(ix <= _tokenIdCounter.current(), "NFT index > max supply");

//         isRedeemed[ix] = true;
//     }

// /// @dev Open the SAle window for the next day (fromTime, toTime -- when NFTs will be for sale)
// /// @dev The meal needs to be picked up by pickUpTime - else the money is transferred to restaurant
// /// @dev When opening a sale window - the restaurant needs to provide numMealsForSale (ex: Next 18 hours - pickUpBy 3pm - am selling 300 tacos)
//     function openSaleWindow(
//         uint256 fromTime,
//         uint256 toTime,
//         uint256 pickUpBy,
//         uint256 numMealsForSale
//     ) public onlyOwner whenNotPaused {}
   }
