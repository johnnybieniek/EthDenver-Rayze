// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {MealToken} from "./MealToken.sol";

contract RayzeMarketplace {
    MealToken public mealToken;

    constructor(string memory _tokenName, string memory _tokenSymbol) {
        mealToken = new MealToken(_tokenName, _tokenSymbol);
    }
}
