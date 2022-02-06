/* eslint-disable prettier/prettier */
import { ethers } from "hardhat";
import web3 from "web3";
async function main() {
  const [collectionOwner] = await ethers.getSigners();
  const BundlrFactory = await ethers.getContractFactory("BundlrFactory", {
    signer: collectionOwner,
  });
  const bundler = await BundlrFactory.deploy(
    "0x8C7382F9D8f56b33781fE506E897a4F1e2d17255",
    "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    "0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4",
    ethers.utils.parseEther("0.0001")
  );

  await bundler.deployed();

  console.log("bundler deployed to:", bundler.address);
  const metadata = JSON.stringify({
    description: "redeem exciting new in-game SCI-FI items",
  });
  const newCollectionTxn = await bundler
    .connect(collectionOwner)
    .createNewCollection(
      web3.utils.toBN(10).toString(),
      "SCC",
      "SCFCRATE",
      metadata
    );
  await newCollectionTxn.wait();
  const currentCount = await bundler.collectionCount();
  for (let i = 0; i < currentCount.toNumber(); i++) {
    const addr = await bundler.collections(web3.utils.toBN(i).toString());
    console.log(addr);
    const bundleContract = await ethers.getContractAt("Bundle", addr);
    console.log(
      await bundleContract.MAX_SUPPLY(),
      await bundleContract.symbol(),
      await bundleContract.name()
    );
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
