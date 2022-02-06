/* eslint-disable prettier/prettier */
import { ethers  } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import web3 from "web3";
// eslint-disable-next-line node/no-missing-import
import {  BundlrFactory } from "../typechain";
describe("Bundlr", function () {
  let collectionOwner: SignerWithAddress;
  let crateOwner: SignerWithAddress;
  let collectionFactory: BundlrFactory;
  before(async () => {
    [collectionOwner, crateOwner] = await ethers.getSigners();
    collectionFactory = await ethers.getContractAt(
      "BundlrFactory",
      "0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f"
    );
  });
  it("create new cycle and redeem it", async function () {
    const collectionAddress = await collectionFactory.collections(
      web3.utils.toBN(0).toString()
    );
    const newBundle = await ethers.getContractAt("Bundle", collectionAddress);
    const emptyCrate = {
      HasERC721: false,
      HasERC20: false,
      ERC721Address: "0x0000000000000000000000000000000000000000",
      ERC721Tokens: [],
      ERC20Address: "0x0000000000000000000000000000000000000000",
      ERC20Amount: web3.utils.toBN(0).toString(),
    };

    const RedeemCrate = [
      {
        HasERC721: false,
        HasERC20: true,
        ERC721Address: "0x0000000000000000000000000000000000000000",
        ERC721Tokens: [],
        ERC20Address: "0x7a2088a1bFc9d81c55368AE168C2C02570cB814F",
        ERC20Amount: web3.utils.toBN(10).toString(),
      },
    ];
    for (let i = 0; i < 9; i++) {
      RedeemCrate.push(emptyCrate);
    }
    const cycleTxn = await newBundle
      .connect(collectionOwner)
      .newCycle(RedeemCrate, web3.utils.toWei("1", "ether"));
    await cycleTxn.wait();
    console.log(await newBundle.currentDropCycle());
    const mintTxn = await newBundle.connect(crateOwner).mint();
    await mintTxn.wait();
    console.log(await newBundle.balanceOf(crateOwner.address));
    const redeemTxn = await newBundle.connect(crateOwner).redeem("1", {
      value: web3.utils.toWei("1", "ether"),
    });
    await redeemTxn.wait();
    const redeemTxn2 = await newBundle.connect(crateOwner).redeem("1");
    await redeemTxn2.wait();
  });
  // it("Create New Collection", async function () {
  //   const metadata = JSON.stringify({
  //     creator: collectionOwner,
  //     decription: "redeem exciting new axies from these crates",
  //   });
  //   const newCollectionTxn = await collectionFactory
  //     .connect(collectionOwner)
  //     .createNewCollection(web3.utils.toBN(10).toString(), "AXS", "AXSCRATE", metadata);
  //   await newCollectionTxn.wait();
  //   const currentCount = await collectionFactory.collectionCount();
  //   for (let i = 0; i < currentCount.toNumber(); i++) {
  //     const addr = await collectionFactory.collections(web3.utils.toBN(i).toString());
  //     console.log(addr);
  //     const bundleContract = await ethers.getContractAt("Bundle", addr);
  //     console.log(
  //       await bundleContract.MAX_SUPPLY(),
  //       await bundleContract.symbol(),
  //       await bundleContract.name()
  //     );
  //   }
  // });
});
