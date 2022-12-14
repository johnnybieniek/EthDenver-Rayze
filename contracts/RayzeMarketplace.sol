// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import {IRayzeMeal} from "./IRayzeMeal.sol";
import "hardhat/console.sol";

error RayzeMarketplace__AccountHasToBeOwner();
error RayzeMarketplace__OnlyOwnerCanRedeem();
error RayzeMarketplace__MealAlreadyRedeemed();
error RayzeMarketplace__SalesNotOpen();
error RayzeMarketplace__SenderIsNotTheRestaurantOwner();

/// @title RayzeMeal - Tokenized meals which are redeemable
/// @author Jamshed Cooper, Jan Bieniek

contract RayzeMarketplace is IERC721Receiver {
    using SafeERC20 for IERC20;
    /// @dev Variables required for Marketplace
    address public rayzeToken;
    bool public isBookingOpen;
    address public owner;

    /// @dev RestaurantInfo and list of restaurants
    struct RestaurantInfo {
        string name;
        address owner;
        string pickupSpot;
        uint256 pickupBy;
        bool paused;
    }
    RestaurantInfo[] public restaurantList;
    mapping(string => RestaurantInfo) public restaurantLookup;

    /// @dev List of Meals
    mapping(string => address[]) public rayzeMealLookup;
    address[] public rayzeMealList;

    /// @notice Modifiers - Ensure onlyByOwner
    modifier onlyByOwner() {
        console.log("only by owner", msg.sender, owner);
        if (msg.sender != owner) revert RayzeMarketplace__AccountHasToBeOwner();
        _;
    }

    /// @dev Create and Deploy contract and setup MealToken
    /// @dev Called by the Owner of the Rayze Restaurant Network

    constructor(address _rayzeToken) {
        rayzeToken = _rayzeToken;
        isBookingOpen = false;
        owner = msg.sender;
    }

    /// @dev register the restaurant as a wallet that can issue NFTs
    /// @dev will be called by restaurants to register themselves
    function registerRestaurant(
        string memory _name,
        string memory _pickupSpot,
        uint256 _pickupBy
    ) public {
        if (
            keccak256(abi.encodePacked(restaurantLookup[_name].name)) ==
            keccak256(abi.encodePacked(_name))
        ) {
            return;
        }
        RestaurantInfo memory newRest = RestaurantInfo({
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
    function registerRayzeMeal(string memory _restName, address _rayzeMeal) external {
        console.log("register rayze meal", restaurantLookup[_restName].owner == msg.sender);
        //require(restaurantLookup[_restName].owner == msg.sender, "sender not rest owner");
        rayzeMealLookup[_restName].push(_rayzeMeal);
        rayzeMealList.push(_rayzeMeal);
    }

    /// @dev Returns balance of booked meals (# meals that are booked)
    function setBookingOpen(bool _isBookingOpen) public onlyByOwner {
        isBookingOpen = _isBookingOpen;
    }

    /// @dev Customer is the sender - and books a meal
    function bookMeal(address _mealAddress) public {
        //require() msg.sender has to have enough cash
        IERC20(rayzeToken).safeTransferFrom(
            msg.sender,
            address(this),
            IRayzeMeal(_mealAddress).cost()
        );
        IRayzeMeal(_mealAddress).safeMint(msg.sender);
        //IRayzeMeal(_mealAddress).safeTransferFrom(address(this), msg.sender, _tokId);
    }

    /// @dev Customer is the sender - and redeems and picksUp a meal
    function redeemMeal(address _mealAddress, uint256 _tokId) public {
        //require() msg.sender has to have enough cash
        if (IRayzeMeal(_mealAddress).ownerOf(_tokId) != msg.sender)
            revert RayzeMarketplace__OnlyOwnerCanRedeem();
        if (IRayzeMeal(_mealAddress).isRedeemed(_tokId) != false)
            revert RayzeMarketplace__MealAlreadyRedeemed();
        IERC20(rayzeToken).safeTransfer(
            IRayzeMeal(_mealAddress).restaurantOwner(),
            IRayzeMeal(_mealAddress).cost()
        );
        IRayzeMeal(_mealAddress).setIsRedeemed(_tokId, true);
    }

    /// @dev Restaurant opens meal sales -- so opens up numMealsForSale of RayzeMeals
    /// @dev When opening a sale window - the restaurant needs to provide numMealsForSale (ex: Next 18 hours - pickUpBy 3pm - am selling 300 tacos)
    function openMealSales(
        string memory _restName,
        address _mealAddress,
        uint256 numMealsForSale
    ) public {
        if (isBookingOpen != true) revert RayzeMarketplace__SalesNotOpen();
        if (restaurantLookup[_restName].owner != msg.sender)
            revert RayzeMarketplace__SenderIsNotTheRestaurantOwner();

        IRayzeMeal(_mealAddress).mintForAddress(numMealsForSale, address(this));
    }

    /// @dev recieve erc721
    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
