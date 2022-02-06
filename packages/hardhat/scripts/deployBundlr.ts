/* eslint-disable prettier/prettier */
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import {  ethers } from "hardhat";
import web3 from "web3";
async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const [collectionOwner] = await ethers.getSigners();
  const BundlrFactory = await ethers.getContractFactory("BundlrFactory",{
    signer:collectionOwner
  });
  const bundler = await BundlrFactory.deploy();

  await bundler.deployed();
  
  console.log("bundler deployed to:", bundler.address);
  const metadata = JSON.stringify({
    decription: "redeem exciting new axies from these crates",
  });
  const newCollectionTxn = await bundler
    .connect(collectionOwner)
    .createNewCollection(
      web3.utils.toBN(10).toString(),
      "AXS",
      "AXSCRATE",
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
