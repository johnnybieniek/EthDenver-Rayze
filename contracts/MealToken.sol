// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

error MealToken__NotEnoughEthSent();
error MealToken__NothingToWithdraw();

/// @title MealToken - ERC20 token that can be used to purchase meals on the marketplace
/// @author Jamshed Cooper, Jan Bieniek
/// @dev Each token can be purchased for a stablecoin with a 1:1 ratio.

contract MealToken is ERC20, ERC20Burnable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// @dev The MealToken contract is deployed by the RayzeMarketplace. The name and symbol come from that contract
    constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    /// @dev The mint transaction is sent by the user and comes from the RayzeMarketplace contract
    /// @dev The marketplace receives a certain value in stablecoins and sends the corresponding amount of tokens to the user
    function mint(address to) public payable {
        if (msg.value < 1e15) revert MealToken__NotEnoughEthSent();
        uint256 amount = msg.value * 1000;
        _mint(to, amount);
    }

    /// @dev The mint transaction is sent by the user and comes from the RayzeMarketplace contract
    /// @dev The marketplace receives a certain value in stablecoins and sends the corresponding amount of tokens to the user
    function mintAmount(address to, uint256 amount) external {
        _mint(to, amount);
    }

    /// @dev function that allows the contract's owner to withdraw ETH
    function withdrawEther() public payable onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 contractBalance = address(this).balance;
        if (contractBalance == 0) revert MealToken__NothingToWithdraw();

        address payable to = payable(msg.sender);
        to.transfer(contractBalance);
    }
}
