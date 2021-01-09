const TokenFarm = artifacts.require("TokenFarm");
const DappToken = artifacts.require("DappToken");
const DaiToken = artifacts.require("DaiToken");

module.exports = async function(deployer, network, accounts) {
  //Deploy DappToken
  await deployer.deploy(DappToken);
  const dappToken = await DappToken.deployed();

  //Deploy DaiToken
  await deployer.deploy(DaiToken);
  const daiToken = await DaiToken.deployed();

  //Deploy TokenFarm
  await deployer.deploy(TokenFarm, dappToken.address, daiToken.address);
  const tokenFarm = await TokenFarm.deployed();

  //Transfer all DappTokens to TokenFarm
  await dappToken.transfer(tokenFarm.address, "1000000000000000000000000");

  //Transfer 100 MockDai Tokens to Investor
  await daiToken.transfer(accounts[1], "100000000000000000000");
};
