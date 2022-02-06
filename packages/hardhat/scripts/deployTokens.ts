/* eslint-disable prettier/prettier */
import { ethers } from "hardhat";
async function main() {
  const [collectionOwner] = await ethers.getSigners();
  const TokenERC20 = await ethers.getContractFactory("SCIFIToken", {
    signer: collectionOwner,
  });
  const deployedToken = await TokenERC20.deploy();
  await deployedToken.deployed();
  console.log(await deployedToken.balanceOf(collectionOwner.address));

  console.log("ERC20 deployed to:", deployedToken.address);
//   const TokenERC721 = await ethers.getContractFactory("GameItem", {
//     signer: collectionOwner,
//   });
//   const deplyedNFTToken = await TokenERC721.deploy();
//   await deplyedNFTToken.deployed();
//   console.log("ERC721 deployed to:", deplyedNFTToken.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
