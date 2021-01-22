const { assert } = require("chai");

const TokenFarm = artifacts.require("TokenFarm");
const DappToken = artifacts.require("DappToken");
const DaiToken = artifacts.require("DaiToken");

require("chai")
  .use(require("chai-as-promised"))
  .should();

function tokens(n) {
  return web3.utils.toWei(n, "ether");
}

contract("TokenFarm", ([owner, investor]) => {
  let daiToken, dappToken, tokenFarm;

  before(async () => {
    daiToken = await DaiToken.new();
    dappToken = await DappToken.new();
    tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);

    //Transfer all Dapp Tokens to farm
    await dappToken.transfer(
      tokenFarm.address,
      web3.utils.toWei("1000000", "ether")
    );

    //Transfer 100 Dai Tokens to investor
    await daiToken.transfer(investor, web3.utils.toWei("100", "ether"), {
      from: owner,
    });
  });

  describe("Mock Dai deployment", async () => {
    it("has a name", async () => {
      const name = await daiToken.name();
      assert.equal(name, "Mock DAI Token");
    });

    it("has transferred tokens to investor", async () => {
      const investorBalance = await daiToken.balanceOf(investor);
      assert.equal(investorBalance.toString(), "100000000000000000000");
    });
  });

  describe("Dapp Token deployment", async () => {
    it("has a name", async () => {
      const name = await dappToken.name();
      assert.equal(name, "DApp Token");
    });
  });

  describe("Token Farm deployment", async () => {
    it("has a name", async () => {
      const name = await tokenFarm.name();
      assert.equal(name, "Token Farm");
    });

    it("has DApp Tokens", async () => {
      const dappBalance = await dappToken.balanceOf(tokenFarm.address);
      assert.equal(dappBalance, "1000000000000000000000000");
    });
  });

  describe("Farming tokens", async () => {
    it("rewards investors for staking Dai tokens", async () => {
      //check balance before staking
      const resultBefore = await daiToken.balanceOf(investor);
      assert.equal(
        resultBefore.toString(),
        tokens("100"),
        "investor dai balance should be 100 before staking"
      );

      await daiToken.approve(tokenFarm.address, tokens("100"), {
        from: investor,
      });
      tokenFarm.stakeTokens(tokens("100"), { from: investor });

      //check staking result
      const result = await daiToken.balanceOf(investor);
      assert.equal(
        result.toString(),
        tokens("0"),
        "investor dai balance should be correct after staking"
      );

      //check stake balance
      const stakeBalance = await tokenFarm.stakeBalance(investor);
      assert.equal(
        stakeBalance.toString(),
        tokens("100"),
        "investor stake balance after staking should be correct"
      );
    });

    it("issues investors with Dapp tokens", async () => {
      await tokenFarm.issueTokens({ from: owner });
      const dappBalance = await dappToken.balanceOf(investor);
      assert.equal(
        dappBalance.toString(),
        tokens("100"),
        "investor dapp balance"
      );
    });

    it("returns dai tokens on unstaking", async () => {
      await tokenFarm.unstakeTokens({ from: investor });
      const stakeBalance = await tokenFarm.stakeBalance(investor);
      assert.equal(
        stakeBalance.toString(),
        tokens("0"),
        "investor stake balance should be zero after unstaking"
      );
    });
  });
});
