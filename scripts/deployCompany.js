// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require("hardhat");
// const hre = require("hardhat");
const deployedFactoryAddress = "0x6b1a6985E4Ab56f9dA93DF88E067DA18b847F084";
const factory = require("../artifacts/contracts/CompanyFactory.sol/CompanyFactory.json");
const factoryABI = factory.abi;
require("dotenv").config();

const provider = new ethers.providers.JsonRpcProvider(process.env.KOVAN_URL);


async function main() {

  let accounts = await ethers.getSigners();
  
  const [account1] = await ethers.getSigners();

  const companyFactory = new ethers.Contract(deployedFactoryAddress, factoryABI, provider);

  await companyFactory.connect(accounts[0]).createCompany().then(console.log);
  // We get the contract to deploy

  // const companyId = await companyFactory.getCompanyIdByOwner(account1.address);

  // console.log("company Id is: ", companyId);

  // const company = await companyFactory.getCompanyById(companyId);
  // console.log("company deployed to:", company);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
