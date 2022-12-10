// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {MealToken} from "./MealToken.sol";
import {RayzeMeal} from "./RayzeMeal.sol";

/// @title RayzeMeal - Tokenized meals which are redeemable
/// @author Jamshed Cooper, Jan Bieniek

contract RayzeMarketplace {

/// @dev Variables required for Marketplace
    MealToken public mealToken;
    bool public isBookingOpen;
    address public owner;

/// @dev RestaurantInfo and list of restaurants
    struct RestaurantInfo {
        string  name;
        address owner;
        string  pickupSpot;
        uint256 pickupBy;
        bool    paused;
    }
    RestaurantInfo [] public restaurantList;
    mapping(string => RestaurantInfo) public restaurantLookup;

/// @dev List of Meals
    mapping(string => address []) public rayzeMealLookup;
    address [] public rayzeMealList;

/// @notice Modifiers - Ensure onlyByOwner
    modifier onlyByOwner() {
        require(msg.sender == owner, "sender has to be owner");
        _;
    }

/// @dev Create and Deploy contract and setup MealToken
/// @dev Called by the Owner of the Rayze Restaurant Network

    constructor(
        string memory _tokenName,
        string memory _tokenSymbol) {
        mealToken = new MealToken(_tokenName, _tokenSymbol);
        isBookingOpen = false;
    }

/// @dev register the restaurant as a wallet that can issue NFTs
/// @dev will be called by restaurants to register themselves
    function registerRestaurant(string memory _name, string memory _pickupSpot, uint256 _pickupBy) public {
        if (keccak256(abi.encodePacked(restaurantLookup[_name].name)) == keccak256(abi.encodePacked(_name))) {
            return;
        }
        RestaurantInfo memory newRest = RestaurantInfo(
            {
            name: _name,
            owner: msg.sender,
            pickupSpot: _pickupSpot,
            pickupBy: _pickupBy,
            paused: false
            });
        restaurantList.push(newRest);
        restaurantLookup[_name] = newRest;        
    }

/// @dev Restaurant can create a new Meal (Taco or Burrito or Pizza entry) as an NFT.
    function createRayzeMeal(string memory _restName, string memory _name, string memory _symbol, uint256 _cost, string memory _uriPrefix) public {
          require(restaurantLookup[_restName].owner == msg.sender, "sender not rest owner");
          RayzeMeal rMeal = new RayzeMeal(_name, _symbol, _cost, _uriPrefix, msg.sender);
          rayzeMealLookup[_restName].push(address(rMeal));
          rayzeMealList.push(address(rMeal));
    }

/// @dev Returns balance of booked meals (# meals that are booked)
    function setBookingOpen(bool _isBookingOpen) public onlyByOwner {
        isBookingOpen = _isBookingOpen;
    }

/// @dev Returns balance of booked meals (# meals that are booked)
    function balanceBooked(address rayzeMealContract) public returns (uint256) {}

/// @dev Returns balance of redeemed meals (MealCoin / USDC that is in escrow)
    function escrowBalance(address rayzeMealContract) public returns (uint256) {}
}

// RayzeNetwork
// - withdrawRedeemed

// - loadMealCoin(eth or usdc)
// - bookRayzeMeal(RayzeMeal contract address
//    , Number of meals to buy)
// - redeemMeal(RayzeMeal contract address)
