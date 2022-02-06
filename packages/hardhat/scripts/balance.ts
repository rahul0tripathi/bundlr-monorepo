/* eslint-disable prettier/prettier */
import { ethers } from "hardhat";
async function main() {
  const [collectionOwner, crateOwner] = await ethers.getSigners();

  const ERC20 = await ethers.getContractAt(
    "SCIFIToken",
    "0x7a2088a1bFc9d81c55368AE168C2C02570cB814F"
  );
  console.log(
    await ERC20.balanceOf(collectionOwner.address),
    await ERC20.balanceOf(crateOwner.address)
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
