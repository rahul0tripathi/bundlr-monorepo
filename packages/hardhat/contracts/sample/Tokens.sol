// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;
pragma experimental ABIEncoderV2;

import {ERC20} from "../../lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract SCIFIToken is ERC20 {
     uint constant _initial_supply = 100 * (10**18);
    constructor() public ERC20("SciFi", "SCF") {
        _mint(msg.sender, _initial_supply);
    }
}