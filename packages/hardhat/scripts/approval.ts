/* eslint-disable prettier/prettier */
import { ethers } from "hardhat";
import web3 from "web3";
async function main() {
  const [collectionOwner] = await ethers.getSigners();
  const collectionFactory = await ethers.getContractAt(
    "BundlrFactory",
    "0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f"
  );
  const collectionAddress = await collectionFactory.collections(
    web3.utils.toBN(0).toString()
  );
  const ERC20 = await ethers.getContractAt("SCIFIToken", "0x7a2088a1bFc9d81c55368AE168C2C02570cB814F");
  const approvalTX = await ERC20.connect(collectionOwner).approve(
    collectionAddress,
    web3.utils.toBN(5000).toString()
  );
  await approvalTX.wait();
  const ERC721 = await ethers.getContractAt("GameItem", "0x09635F643e140090A9A8Dcd712eD6285858ceBef");
  const operatorTx = await ERC721.connect(collectionOwner).setApprovalForAll(
    collectionAddress,
    true
  );
  await operatorTx.wait();
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
