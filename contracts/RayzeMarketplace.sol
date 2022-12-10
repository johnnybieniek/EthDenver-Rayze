// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {MealToken} from "./MealToken.sol";
import {RayzeMeal} from "./RayzeMeal.sol";

/// @title RayzeMeal - Tokenized meals which are redeemable
/// @author Jamshed Cooper, Jan Bieniek

contract RayzeMarketplace {
    MealToken public mealToken;
    RayzeMeal public rayzeMeal;

    uint256 public mealPurchaseRatio = 1000;

    constructor(
        string memory _tokenName,
        string memory _tokenSymbol,
        string memory _nftName,
        string memory _nftSymbol
    ) {
        mealToken = new MealToken(_tokenName, _tokenSymbol);
        rayzeMeal = new RayzeMeal(_nftName, _nftSymbol);
    }

    /// @dev Purchase meal tokens with Goerli ETH with ratio 1 ETH = 1000 MTK (for now)
    function purchaseMealTokens() external payable {
        mealToken.mint(msg.sender, msg.value * 1000);
    }

    /// @dev register the restaurant as a wallet that can issue NFTs
    function registerRestaurant() public {
        //we should be able to control which restaurant issues NFTs. and should be able to switch them off if required.
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
