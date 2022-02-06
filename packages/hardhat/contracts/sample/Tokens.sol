// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;
pragma experimental ABIEncoderV2;

import {ERC20} from "../../lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract SCIFIToken is ERC20 {
    constructor(uint256 initialSupply) public ERC20("SciFi", "SCF") {
        _mint(msg.sender, initialSupply);
    }
}