// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

library BundleType {
    struct Bundle {
        bool HasERC721;
        bool HasERC20;
        address ERC721Address;
        uint256[] ERC721Tokens;
        address ERC20Address;
        uint256 ERC20Amount;
    }
}
