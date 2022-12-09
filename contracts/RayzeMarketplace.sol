// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/AccessControl.sol";
import {MealToken} from "./MealToken.sol";

contract RayzeMarketplace is AccessControl {
    bytes32 public constant FOUNDER_ROLE = keccak256("FOUNDER_ROLE");
    MealToken public mealToken;

    constructor(string memory _tokenName, string memory _tokenSymbol) {
        mealToken = new MealToken(_tokenName, _tokenSymbol);
        _grantRole(FOUNDER_ROLE, msg.sender);
    }
}
