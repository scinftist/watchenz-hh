const { ethers } = require("hardhat");
const { assert, expect } = require("chai");
const fs = require("fs");
const exp = require("constants");
let _verbose = false;
describe("testing WatchenzToken.sol", () => {
  let watchenzToken, watchenzDB, watchenzRenderer, watchenzChannel;
  const _price = ethers.toBigInt("1000000000000000");
  let csv, whiteListArray, acclist, addresses, quantities;
  const _itemInAuction = 5;
  beforeEach(async function () {
    acclist = await ethers.getSigners();

    ///--------------
    watchenzToken = await ethers.deployContract("WatchenzToken");
    if (_verbose) console.log("Deploying WatchenzToken Contract ...");
    await watchenzToken.waitForDeployment();
    if (_verbose)
      console.log(
        `Deployed WatchenzToken contract to:${await watchenzToken.getAddress()}`
      );
    //-----
    watchenzDB = await ethers.deployContract("WatchenzDB");
    if (_verbose) console.log("Deploying WatchenzDB Contract...");
    await watchenzDB.waitForDeployment();
    if (_verbose)
      console.log(
        `Deployed WatchenzDB contract to:${await watchenzDB.getAddress()}`
      );
    //-----
    watchenzRenderer = await ethers.deployContract("WatchenzRenderer");
    if (_verbose) console.log("Deploying WatchenzRenderer Contract...");
    await watchenzRenderer.waitForDeployment();
    if (_verbose)
      console.log(
        `Deployed WatchenzRenderer contract to:${await watchenzRenderer.getAddress()}`
      );

    //-----
    watchenzChannel = await ethers.deployContract("WatchenzChannel");
    if (_verbose) console.log("Deploying watchenzChannel Contract...");
    await watchenzChannel.waitForDeployment();
    if (_verbose)
      console.log(
        `Deployed watchenzChannel contract to:${await watchenzChannel.getAddress()}`
      );

    //---set WatchenzToken
    watchenzToken.setDB(await watchenzDB.getAddress());
    if (_verbose) console.log(`getDB ${await watchenzToken.getDB()}`);
    await watchenzToken.setMetadateRenderer(await watchenzDB.getAddress());
    if (_verbose)
      console.log(
        `getMetadataRenderer ${await watchenzToken.getMetadataRenderer()}`
      );

    //--- set WatchenzDB
    await watchenzDB.setTokenContract(await watchenzToken.getAddress());
    if (_verbose)
      console.log(`getTokenContract ${await watchenzDB.getTokenContract()}`);

    //
    await watchenzRenderer.setWatchenzDB(await watchenzDB.getAddress());
    if (_verbose)
      console.log(
        `getWatchenzDB contract ${await watchenzRenderer.getWatchenzDB()}`
      );
    //--
    await watchenzDB.setChannelContract(await watchenzChannel.getAddress());
    if (_verbose)
      console.log(
        `getChannelContract contract ${await watchenzDB.getChannelContract()}`
      );

    addresses = [];
    quantities = [];

    for (let i = 1; i < 10; i++) {
      addresses.push(acclist[i].address);
      quantities.push(getRandomIntInclusive(24, 26));
    }
    await watchenzToken.addToWhitelist(addresses, quantities);
  });
  it("watchenzToken: mint whiteList", async () => {
    let _signer;
    for (let j = 0; j < addresses.length; j++) {
      _signer = await ethers.getSigner(addresses[j]);
      await watchenzToken.connect(_signer).whitelistMint();

      assert.equal(await watchenzToken.balanceOf(addresses[j]), quantities[j]);
    }
  });

  it("watchenzToken: double mint in whitelist prevented", async () => {
    let _signer;

    _signer = await ethers.getSigner(addresses[1]);
    await expect(watchenzToken.connect(_signer).whitelistMint()).not.to.be
      .reverted;

    await expect(
      watchenzToken.connect(_signer).whitelistMint()
    ).to.be.revertedWith(
      "you are not whitelisted or you have claimed your tokens"
    );

    assert.equal(await watchenzToken.balanceOf(addresses[1]), quantities[1]);
  });

  it("watchenzToken: public mint quantity", async () => {
    let _signer;
    let _quant;
    let _bigQuant;
    // for(let j = 0;j)
    for (let j = 0; j < addresses.length; j++) {
      _quant = getRandomIntInclusive(23, 100);
      _bigQuant = BigInt(_quant);
      _signer = await ethers.getSigner(addresses[j]);
      await watchenzToken
        .connect(_signer)
        .mintWatchenz(_quant, { value: _price * _bigQuant });
      if (_verbose)
        console.log(`bal: ${await watchenzToken.balanceOf(_signer)}`);
      assert.equal(await watchenzToken.balanceOf(addresses[j]), _quant);
    }
  });

  it("watchenzToken: public mint value", async () => {
    let _signer;
    let _quant;
    let _bigQuant;
    // for(let j = 0;j)
    // for (let j = 0; j < addresses.length; j++) {
    _quant = getRandomIntInclusive(23, 100);
    _bigQuant = BigInt(1);
    _signer = await ethers.getSigner(addresses[1]);
    await expect(
      watchenzToken
        .connect(_signer)
        .mintWatchenz(_quant, { value: _price * _bigQuant })
    ).to.be.revertedWith("wrong value of ETH send");
  });

  it("watchenzToken: tokenUri not empty", async () => {
    let _signer;
    let _quant;
    let _bigQuant;
    // for(let j = 0;j)
    // for (let j = 0; j < addresses.length; j++) {
    _quant = getRandomIntInclusive(23, 100);
    _bigQuant = BigInt(_quant);
    _signer = await ethers.getSigner(addresses[1]);
    await watchenzToken
      .connect(_signer)
      .mintWatchenz(_quant, { value: _price * _bigQuant });
    console.log(`tokenURI: ${await watchenzToken.getMetadataRenderer()}`);
    console.log(`tokenURI: ${await watchenzRenderer.tokenURI(2)}`);
    console.log(`tokenURI: ${await watchenzToken.tokenURI(2)}`);
    // await expect(await watchenzToken.tokenURI(2)).not.to.be(
    //   "metadate-renderer-placeholder"
    // );
  });

  it("watchenzToken: public mint maxSupply and white list previlaged", async () => {
    let _signer;
    let _quant;
    let _bigQuant;
    // for(let j = 0;j)
    for (let j = 0; j < 199; j++) {
      _quant = getRandomIntInclusive(23, 100);
      _bigQuant = BigInt(100);
      _signer = await ethers.getSigner(addresses[j % 9]);
      await watchenzToken
        .connect(_signer)
        .mintWatchenz(100, { value: _price * _bigQuant });
    }
    console.log(`tot: ${await watchenzToken.totalSupply()}`);
    // assert.equal(await watchenzToken.totalSupply(), 20000);
    await expect(
      watchenzToken
        .connect(_signer)
        .mintWatchenz(100, { value: _price * _bigQuant })
    ).to.be.revertedWith("wait for next Phase");

    // let _signer;
    for (let j = 1; j < 3; j++) {
      _signer = await ethers.getSigner(addresses[j]);
      await expect(watchenzToken.connect(_signer).whitelistMint()).not.to.be
        .reverted;
    }
  });

  // it("WatchenzDataHandler: finalize", async () => {
  //   // const _MtokenBalance = await Mtoken.balanceOf(MAH.address);
  //   await watchenzRenderer.set_svg(0, 0, "a-data", "a-title");

  //   let getDataString = await watchenzRenderer.get_svg(0, 0);
  //   let gettitleString = await watchenzRenderer.get_title(0, 0);
  //   assert.equal(getDataString, "a-data");
  //   assert.equal(gettitleString, "a-title");
  //   await watchenzRenderer.finalizeSVG();
  //   expect(
  //     watchenzRenderer.set_svg(0, 0, "b-data", "b-title")
  //   ).to.be.revertedWith("svg has been finalized");
  // });

  // maybe onlyOwner
});

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}
