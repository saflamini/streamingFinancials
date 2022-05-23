// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require("hardhat");
const hre = require("hardhat");
const superfluidHost = "0xF0d7d1D47109bA426B9D8A3Cde1941327af1eea3";

async function main() {

  let accounts = await ethers.getSigners();
  
  const [account1] = await ethers.getSigners();

  console.log('running deploy factory script...')
  // We get the contract to deploy
  const CompanyFactory = await hre.ethers.getContractFactory("CompanyFactory");
  const companyFactory = await CompanyFactory.deploy(superfluidHost);
  
  await companyFactory.deployed();

  console.log("CompanyFactory.sol deployed to:", companyFactory.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });