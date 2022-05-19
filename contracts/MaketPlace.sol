pragma solidity ^0.5.6;

import "./CoffeeBeansNFT.sol";

contract Market {

  struct Item {
    uint256 itemId;
    uint256 tokenId;
    address payable seller;
    uint256 price;
    bool sold;
    bool canceled;
  }

  
  
}