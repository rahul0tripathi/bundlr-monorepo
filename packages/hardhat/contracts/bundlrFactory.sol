// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;
pragma experimental ABIEncoderV2;
import {Counters} from "../lib/openzeppelin-contracts/contracts/utils/Counters.sol";
import {Bundle} from "./bundlr.sol";

contract BundlrFactory {
    using Counters for Counters.Counter;
    address[] public collections;
    bytes32 internal keyHash;
    uint256 internal fee;
    address internal vrfCoordinator;
    address internal link;
    mapping(uint256 => address) private _collectionsList;

    Counters.Counter public collectionCount;

    constructor(
        address _vrfCoordinator,
        address _link,
        bytes32 _keyHash,
        uint256 _fee
    ) {
        vrfCoordinator = _vrfCoordinator;
        link = _link;
        keyHash = _keyHash;
        fee = _fee;
    }

    function createNewCollection(
        uint256 maxSupply,
        string memory symbol,
        string memory name,
        string memory metadata
    ) external {
        collectionCount.increment();
        address newCollection = address(
            new Bundle(
                maxSupply,
                symbol,
                name,
                metadata,
                msg.sender,
                vrfCoordinator,
                link,
                keyHash,
                fee
            )
        );
        _collectionsList[collectionCount.current()] = newCollection;
        collections.push(newCollection);
    }
}
