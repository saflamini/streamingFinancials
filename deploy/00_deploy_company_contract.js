
const superfluidHost = "0xF0d7d1D47109bA426B9D8A3Cde1941327af1eea3";
require("@nomiclabs/hardhat-ethers");

module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();

    console.log(deployer);
    

    await deploy('Cash', {
      from: deployer,
      args: [superfluidHost],
      log: true,
    });
  };
  
  module.exports.tags = ['Cash'];