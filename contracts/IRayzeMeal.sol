// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;


interface IRayzeMeal  {

    function safeMint(address to) external;
    function burn(address account, uint256 amount) external returns (bool);
    function mintForAddress(uint256 _mintAmount, address _receiver) external;
    function totalSupply() external returns (uint256);
    function setIsRedeemed(uint256 _ix, bool _value) external;
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
    function ownerOf(uint256 tokenId) external view returns (address owner);
    function isRedeemed(uint256 tokenId) external view returns (bool);
    function restaurantOwner() external view returns (address);
    function cost() external view returns (uint256);
}