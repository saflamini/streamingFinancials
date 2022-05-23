// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require("hardhat");
const hre = require("hardhat");
const superfluidHost = "0xF0d7d1D47109bA426B9D8A3Cde1941327af1eea3";
const deployedCashAddress = "0x22aA05aA45F2DBDdaD534C43F156C7F33Fa6B17C";
const cash = require("../artifacts/contracts/Cash.sol/Cash.json");
const cashABI = cash.abi;


async function main() {

  let accounts = await ethers.getSigners();
  
  const [account1] = await ethers.getSigners();

  const cashContract = new ethers.Contract(deployedCashAddress, cashABI, accounts[0])

  const tokenAddress = "0x06158c4ec4efffcf1bef06b81672252ab83d7150";
  const amount = ethers.utils.parseEther("10");

  await cashContract.connect(accounts[0]).unWrapSuperTokens(tokenAddress, amount).then(console.log);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
