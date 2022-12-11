// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {RayzeMeal} from "./RayzeMeal.sol";

/// @title RayzeMeal - Tokenized meals which are redeemable
/// @author Jamshed Cooper, Jan Bieniek

contract RayzeMarketplace {
    using SafeERC20 for IERC20;
/// @dev Variables required for Marketplace
    address public rayzeToken;
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

    constructor(address _rayzeToken) {
        rayzeToken = _rayzeToken;
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
    function createRayzeMeal(string memory _restName, string memory _name, string memory _symbol, uint256 _cost, string memory _uriPrefix) public returns (address) {
          require(restaurantLookup[_restName].owner == msg.sender, "sender not rest owner");
          RayzeMeal rMeal = new RayzeMeal(_name, _symbol, _cost, _uriPrefix, msg.sender);
          rayzeMealLookup[_restName].push(address(rMeal));
          rayzeMealList.push(address(rMeal));
          return address(rMeal);
    }

/// @dev Returns balance of booked meals (# meals that are booked)
    function setBookingOpen(bool _isBookingOpen) public onlyByOwner {
        isBookingOpen = _isBookingOpen;
    }

/// @dev Customer is the sender - and books a meal
    function bookMeal(address _mealAddress,
        uint256 _tokId) public  {
        //require() msg.sender has to have enough cash
        IERC20(rayzeToken).safeTransferFrom(msg.sender, address(this),
            RayzeMeal(_mealAddress).cost());
        RayzeMeal(_mealAddress).safeTransferFrom(address(this), msg.sender, _tokId);
    }

/// @dev Customer is the sender - and redeems and picksUp a meal
    function redeemMeal(address _mealAddress,
        uint256 _tokId) public  {
        //require() msg.sender has to have enough cash

        require(RayzeMeal(_mealAddress).isRedeemed(_tokId) == false, "Meal is already redeemed");
        IERC20(rayzeToken).safeTransferFrom(address(this),
            RayzeMeal(_mealAddress).restaurantOwner(),
            RayzeMeal(_mealAddress).cost());

        RayzeMeal(_mealAddress).setIsRedeemed(_tokId, true);
    }

/// @dev Restaurant opens meal sales -- so opens up numMealsForSale of RayzeMeals
/// @dev When opening a sale window - the restaurant needs to provide numMealsForSale (ex: Next 18 hours - pickUpBy 3pm - am selling 300 tacos)
    function openMealSales(
        string memory _restName,
        address _mealAddress,
        uint256 numMealsForSale
    ) public  {
        require(isBookingOpen == true, "Sales not open");
        require(restaurantLookup[_restName].owner == msg.sender, "sender not rest owner");

        RayzeMeal(_mealAddress).mintForAddress(numMealsForSale, address(this));
    }
}
