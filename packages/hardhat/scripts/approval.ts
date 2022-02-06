/* eslint-disable prettier/prettier */
import { ethers } from "hardhat";
import web3 from "web3";
async function main() {
  const [collectionOwner] = await ethers.getSigners();
  const collectionFactory = await ethers.getContractAt(
    "BundlrFactory",
    "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  );
  const collectionAddress = await collectionFactory.collections(
    web3.utils.toBN(0).toString()
  );
  const ERC20 = await ethers.getContractAt("SCIFIToken", "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0");
  const approvalTX = await ERC20.connect(collectionOwner).approve(
    collectionAddress,
    web3.utils.toBN(5000).toString()
  );
  await approvalTX.wait();
  const ERC721 = await ethers.getContractAt("GameItem", "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9");
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
