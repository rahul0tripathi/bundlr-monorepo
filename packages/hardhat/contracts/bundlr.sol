// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;
pragma experimental ABIEncoderV2;

import {Ownable} from "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import {ERC721} from "../lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import {IERC721} from "../lib/openzeppelin-contracts/contracts/token/ERC721/IERC721.sol";
import {IERC20} from "../lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {IERC165} from "../lib/openzeppelin-contracts/contracts/utils/introspection/IERC165.sol";
import {ERC721Enumerable} from "../lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {Counters} from "../lib/openzeppelin-contracts/contracts/utils/Counters.sol";
import {ERC721URIStorage} from "../lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {ReentrancyGuard} from "../lib/openzeppelin-contracts/contracts/security/ReentrancyGuard.sol";
import {BundleType} from "./library/bundleType.sol";

contract Bundle is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    Ownable,
    ReentrancyGuard
{
    using Counters for Counters.Counter;
    Counters.Counter public currentDropCycle;
    Counters.Counter public mintedCrates;
    string public collectionMetaData;
    uint256 public MAX_SUPPLY;
    mapping(uint256 => BundleType.Bundle[]) private _bundles;
    mapping(uint256 => uint256) public _redeemPrice;
    mapping(uint256 => mapping(uint256 => bool)) private _redeedmed;

    constructor(
        uint256 maxSupply,
        string memory symbol,
        string memory name,
        string memory metadata,
        address owner
    ) ERC721(name, symbol) {
        collectionMetaData = metadata;
        MAX_SUPPLY = maxSupply;
        super.transferOwnership(owner);
    }

    function mint() public returns (uint256) {
        mintedCrates.increment();
        uint256 newCrateId = mintedCrates.current();
        _safeMint(msg.sender, newCrateId);
        _setTokenURI(newCrateId, "");
        return newCrateId;
    }

    function removeBundleFromList(uint256 bundleId, uint256 cycle) private {
        require(bundleId < _bundles[cycle].length, "invalid bundle");
        _bundles[cycle][bundleId] = _bundles[cycle][_bundles[cycle].length - 1];
        _bundles[cycle].pop();
    }

    function newCycle(BundleType.Bundle[] memory bundles, uint256 redeemPrice)
        external
        onlyOwner
        returns (uint256)
    {
        require(bundles.length == MAX_SUPPLY, "invalid bundle length");
        currentDropCycle.increment();
        for (uint256 i = 0; i < bundles.length; i++) {
            _bundles[currentDropCycle.current()].push(bundles[i]);
        }
        _redeemPrice[currentDropCycle.current()] = redeemPrice;
        return currentDropCycle.current();
    }

    function redeem(uint256 bundleId) external payable {
        require(
            super.ownerOf(bundleId) == msg.sender,
            "you do not own the bundle"
        );
        require(
            msg.value == _redeemPrice[currentDropCycle.current()],
            "insufficent amount to redeem"
        );
        require(
            !_redeedmed[currentDropCycle.current()][bundleId],
            "bundle already redeemed"
        );
        BundleType.Bundle memory redeemBundle = _bundles[
            currentDropCycle.current()
        ][0];
        removeBundleFromList(0, currentDropCycle.current());
        _redeedmed[currentDropCycle.current()][bundleId] = true;
        if (redeemBundle.HasERC721) {
            for (uint256 i = 0; i < redeemBundle.ERC721Tokens.length; i++) {
                IERC721(redeemBundle.ERC721Address).transferFrom(
                    super.owner(),
                    msg.sender,
                    redeemBundle.ERC721Tokens[i]
                );
            }
        }
        if (redeemBundle.HasERC20) {
            IERC20(redeemBundle.ERC20Address).transferFrom(
                super.owner(),
                msg.sender,
                redeemBundle.ERC20Amount
            );
        }
    }

    function getCurrentRedeemPrice() public view returns (uint256) {
        return _redeemPrice[currentDropCycle.current()];
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}
