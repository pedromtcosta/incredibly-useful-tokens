//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DummyCoin is ERC20 {
  constructor(uint256 initialBalance) ERC20("DummyCoin", "DMM") {
    _mint(msg.sender, initialBalance);
  }
}
