const { ethers } = require("hardhat");
const { assert, expect } = require("chai");
const fs = require("fs");
const exp = require("constants");
let _verbose = false;
describe("testing WatchenzDB.sol and WatchenzChannel.sol", () => {
  let watchenzToken, watchenzDB, watchenzRenderer, watchenzChannel;
  let _price = ethers.toBigInt("100000000000000");
  let csv, whiteListArray, acclist, addresses, quantities, _servicePrices;
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
    await watchenzToken.setMetadateRenderer(
      await watchenzRenderer.getAddress()
    );
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

    _price = await watchenzToken.getPrice();
    _servicePrices = [
      ethers.toBigInt("1000000"),
      ethers.toBigInt("2000000"),
      ethers.toBigInt("3000000"),
      ethers.toBigInt("4000000"),
      ethers.toBigInt("5000000"),
    ];
    for (let i = 0; i < 5; i++) {
      await watchenzDB.setPrice(i, _servicePrices[i]);
    }
    addresses = [];
    // quantities = [];
    _price = await watchenzToken.getPrice();
    for (let i = 1; i < 10; i++) {
      addresses.push(acclist[i].address);
      //   quantities.push(getRandomIntInclusive(24, 26));
    }
  });
  it("watchenzDB: setTImeZone", async () => {
    let _signer;

    _signer = await ethers.getSigner(addresses[1]);
    let _value = BigInt(_servicePrices[0]);
    await watchenzToken
      .connect(_signer)
      .mintWatchenz(5, { value: _price * BigInt(5) });
    console.log(`servicePrice0: ${await watchenzDB.getPrice(0)}`);
    await expect(BigInt(await watchenzDB.getPrice(0))).to.equal(
      _servicePrices[0]
    );
    await expect(
      watchenzDB.connect(_signer).setTimeZone(1, 1234, {
        value: await watchenzDB.getPrice(0),
      })
    ).not.to.be.reverted;

    await expect(
      watchenzDB.connect(_signer).setTimeZone(1, 86401, {
        value: await watchenzDB.getPrice(0),
      })
    ).to.be.revertedWith("day is 86400 sec");

    await expect(
      watchenzDB.connect(_signer).setTimeZone(1, 1234, {
        value: 1111,
      })
    ).to.be.revertedWith("bad price0");
    _signer = await ethers.getSigner(addresses[2]);
    await expect(
      watchenzDB.connect(_signer).setTimeZone(1, 1234, {
        value: await watchenzDB.getPrice(0),
      })
    ).to.be.revertedWith("not yours");
  });

  //   it("watchenzToken: double mint in whitelist prevented", async () => {
  //     let _signer;

  //     _signer = await ethers.getSigner(addresses[1]);
  //     await expect(watchenzToken.connect(_signer).whitelistMint()).not.to.be
  //       .reverted;

  //     await expect(
  //       watchenzToken.connect(_signer).whitelistMint()
  //     ).to.be.revertedWith(
  //       "you are not whitelisted or you have claimed your tokens"
  //     );

  //     assert.equal(await watchenzToken.balanceOf(addresses[1]), quantities[1]);
  //   });
});

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}
