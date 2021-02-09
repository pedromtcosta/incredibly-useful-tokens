// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { BigNumber } from "ethers";
import { run, ethers } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile 
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  await run('compile')

  const signers = await ethers.getSigners();

  const PerfectCoin = await ethers.getContractFactory("PerfectCoin", signers[0]);
  const perfectCoin = await PerfectCoin.deploy("5000000000000000000000");

  const WorthlessCoin = await ethers.getContractFactory("WorthlessCoin", signers[0]);
  const worthlessCoin = await WorthlessCoin.deploy("5000000000000000000000");

  const DummyCoin = await ethers.getContractFactory("DummyCoin", signers[0]);
  const dummyCoin = await DummyCoin.deploy("5000000000000000000000");

  await perfectCoin.deployed();
  await worthlessCoin.deployed();
  await dummyCoin.deployed();

  console.log("PerfectCoin deployed to:", perfectCoin.address);
  console.log("WorthlessCoin deployed to:", worthlessCoin.address);
  console.log("DummyCoin deployed to:", dummyCoin.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });