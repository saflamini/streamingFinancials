// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require("hardhat");
const hre = require("hardhat");
const superfluidHost = "0x22ff293e14F1EC3A09B137e9e06084AFd63adDF9";
const deployedCashAddress = "0xA72D37038B2AD7D7B492e27ea265a0bF165a673a";
const cash = require("../artifacts/contracts/Cash.sol/Cash.json");
const cashABI = cash.abi;


async function main() {

  let accounts = await ethers.getSigners();
  
  const [account1] = await ethers.getSigners();

  const cashContract = new ethers.Contract(deployedCashAddress, cashABI, accounts[0])

  //fDAI ERC20 on goeerli
  const tokenAddress = "0x88271d333C72e51516B67f5567c728E702b3eeE8";
  const receiverAddress = "0x9421fe8eccafad76c3a9ec8f9779fafa05a836b3";
  const amount = ethers.utils.parseEther("8");
  const category = 5007;

  await cashContract.connect(accounts[0]).pay(tokenAddress, receiverAddress, amount, category).then(console.log);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
