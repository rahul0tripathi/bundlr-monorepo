// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;
pragma experimental ABIEncoderV2;
import {Counters} from "../lib/openzeppelin-contracts/contracts/utils/Counters.sol";
import {Bundle} from "./bundlr.sol";

contract BundlrFactory {
    using Counters for Counters.Counter;
    address[] public collections;
    mapping(uint256 => address) private _collectionsList;

    Counters.Counter public collectionCount;

    constructor() {}

    function createNewCollection(
        uint256 maxSupply,
        string memory symbol,
        string memory name,
        string memory metadata
    ) external {
        collectionCount.increment();
        address newCollection = address(
            new Bundle(maxSupply, symbol, name, metadata,msg.sender)
        );
        _collectionsList[collectionCount.current()] = newCollection;
        collections.push(newCollection);
    }
}
