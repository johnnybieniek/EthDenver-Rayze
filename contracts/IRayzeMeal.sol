// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;


import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IMealToken is IERC20 {

    function mint(address account, uint256 amount) external returns (bool);
    function burn(address account, uint256 amount) external returns (bool);
}