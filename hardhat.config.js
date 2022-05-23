require("@nomiclabs/hardhat-waffle");
require('hardhat-deploy');
require("dotenv").config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const defaultNetwork = "kovan";
/**
 * 
 * @type import('hardhat/config').HardhatUserConfig
 */

module.exports = {
  defaultNetwork,
  solidity: "0.8.4",
  networks: {
    kovan: {
      url: process.env.KOVAN_URL,
      accounts: [`${process.env.PRIVATE_KEY}`, `${process.env.PRIVATE_KEY2}`]
    },
    mumbai: {
      url: process.env.MUMBAI_URL,
      accounts: [`${process.env.MUMBAI_PRIVATE_KEY}`]
    },
    goerli: {
      url: process.env.GOERLI_URL,
      accounts: [`${process.env.GOERLI_PRIVATE_KEY}`]
    }
  }
};
