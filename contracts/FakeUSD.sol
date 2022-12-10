// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/// @title FAKEUSD - ERC20 token that is used to serve as a USDC token from mainnet. Only used for testing
/// @author Jan Bieniek
/// @dev Each token can be for free. Its only purpose is to be used for testing.

contract FakeUSD is ERC20, ERC20Burnable {
    /// @dev The MealToken contract is deployed by the RayzeMarketplace. The name and symbol come from that contract
    constructor() ERC20("FAKEUSD", "FUSD") {}

    /// @dev The mint transaction is public and there is no supply limit
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
