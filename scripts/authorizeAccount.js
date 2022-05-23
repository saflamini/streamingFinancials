// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require("hardhat");
const hre = require("hardhat");
const superfluidHost = "0xF0d7d1D47109bA426B9D8A3Cde1941327af1eea3";
const deployedCashAddress = "0x0F9F390C7B0630F6e1A91D3b2F0f486690D47756";
const cash = require("../artifacts/contracts/Cash.sol/Cash.json");
const cashABI = cash.abi;
const provider = new ethers.providers.JsonRpcProvider(process.env.KOVAN_URL);


async function main() {

  let accounts = await ethers.getSigners();
  
  const [account1] = await ethers.getSigners();

  const cashContract = new ethers.Contract(deployedCashAddress, cashABI, provider)

  // const tokenAddress = "0x06158c4ec4efffcf1bef06b81672252ab83d7150";
  // const amount = ethers.utils.parseEther("10");

  await cashContract.connect(accounts[0]).authorizeAccountFromOwner("0x5966aa11c794893774a382d9a19743B8be6BFFd1").then(console.log);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
