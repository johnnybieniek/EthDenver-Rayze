// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {MealToken} from "./MealToken.sol";
import {RayzeMeal} from "./RayzeMeal.sol";

/// @title RayzeMeal - Tokenized meals which are redeemable
/// @author Jamshed Cooper, Jan Bieniek

contract RayzeMarketplace {
    MealToken public mealToken;
    RayzeMeal public rayzeMeal;

/// @dev List of all RayzeMeals
    address [] public rayzeMealsList;

/// @dev register the restaurant as a wallet that can issue NFTs
    struct RestaurantInfo {
        string  name;
        string  pickupSpot;
        uint256 pickupBy;
        bool    paused;
    }
    RestaurantInfo [] public restaurantList;
    mapping(string => RestaurantInfo) public restaurantLookup;
    mapping(string => address []) public issuedRayzeMeals;


/// @dev Create and Deploy contract and setup MealToken
/// @dev Called by the Owner of the Rayze Restaurant Network

    constructor(
        string memory _tokenName,
        string memory _tokenSymbol) {
        mealToken = new MealToken(_tokenName, _tokenSymbol);
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
            pickupSpot: _pickupSpot,
            pickupBy: _pickupBy,
            paused: false
            });
        restaurantList.push(newRest);
        restaurantLookup[_name] = newRest;        
    }

    /// @dev Restaurant can create a Rayze Meal NFT of size #of meals - to be minted by eaters
    function issueRayzeMeal(string memory name, string memory symbol, uint256 size) public {}

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
