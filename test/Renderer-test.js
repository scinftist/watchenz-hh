const { ethers } = require("hardhat");
const { assert, expect } = require("chai");

let _verbose = false;
describe("testing WatchenzRenderer.sol", () => {
  let watchenzToken, watchenzDB, watchenzRenderer, watchenzChannel;
  const _itemInAuction = 5;
  beforeEach(async function () {
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
    watchenzToken.setDB(watchenzDB.getAddress());
    if (_verbose) console.log(`getDB ${await watchenzToken.getDB()}`);
    await watchenzToken.setMetadateRenderer(watchenzRenderer.getAddress());
    if (_verbose)
      console.log(
        `getMetadataRenderer ${await watchenzToken.getMetadataRenderer()}`
      );

    //--- set WatchenzDB
    await watchenzDB.setTokenContract(watchenzToken.getAddress());
    if (_verbose)
      console.log(`getTokenContract ${await watchenzDB.getTokenContract()}`);

    //
    await watchenzRenderer.setWatchenzDB(watchenzDB.getAddress());
    if (_verbose)
      console.log(
        `getWatchenzDB contract ${await watchenzRenderer.getWatchenzDB()}`
      );
    //--
    await watchenzDB.setChannelContract(watchenzChannel.getAddress());
    if (_verbose)
      console.log(
        `getChannelContract contract ${await watchenzDB.getChannelContract()}`
      );
  });
  it("WatchenzDataHandler: set_svg get_svg get_title", async () => {
    // const _MtokenBalance = await Mtoken.balanceOf(MAH.address);
    await watchenzRenderer.set_svg(0, 0, "a-data", "a-title");

    let getDataString = await watchenzRenderer.get_svg(0, 0);
    let gettitleString = await watchenzRenderer.get_title(0, 0);
    assert.equal(getDataString, "a-data");
    assert.equal(gettitleString, "a-title");
  });

  it("WatchenzDataHandler: reset_svg", async () => {
    // const _MtokenBalance = await Mtoken.balanceOf(MAH.address);
    let getDataString = await watchenzRenderer.get_svg(0, 1);
    let gettitleString = await watchenzRenderer.get_title(0, 1);
    assert.equal(getDataString, "");
    assert.equal(gettitleString, "");
    await watchenzRenderer.set_svg(0, 1, "a-data", "a-title");

    getDataString = await watchenzRenderer.get_svg(0, 1);
    gettitleString = await watchenzRenderer.get_title(0, 1);
    assert.equal(getDataString, "a-data");
    assert.equal(gettitleString, "a-title");
    await watchenzRenderer.set_svg(0, 1, "b-data", "b-title");
    getDataString = await watchenzRenderer.get_svg(0, 1);
    gettitleString = await watchenzRenderer.get_title(0, 1);
    assert.equal(getDataString, "b-data");
    assert.equal(gettitleString, "b-title");
  });
  it("WatchenzDataHandler: setSVGParts getSVGParts ", async () => {
    await watchenzRenderer.setSVGParts(0, "a-part");

    let getPartString = await watchenzRenderer.getSVGParts(0);

    assert.equal(getPartString, "a-part");
  });

  it("WatchenzDataHandler: reset setSVGParts", async () => {
    // const _MtokenBalance = await Mtoken.balanceOf(MAH.address);
    let getDataString = await watchenzRenderer.getSVGParts(1);
    assert.equal(getDataString, "");
    await watchenzRenderer.setSVGParts(1, "b-part");

    getDataString = await watchenzRenderer.getSVGParts(1);
    assert.equal(getDataString, "b-part");

    await watchenzRenderer.setSVGParts(1, "c-part");
    getDataString = await watchenzRenderer.getSVGParts(1);

    assert.equal(getDataString, "c-part");
  });

  it("WatchenzDataHandler: setGene getSVGParts ", async () => {
    await watchenzRenderer.setGene(0, "0x00");

    let getGeneBytes = await watchenzRenderer.getGene(0);
    // console.log(`${getGeneBytes}`);

    assert.equal(getGeneBytes, "0x00");
  });

  it("WatchenzDataHandler: reset setGene", async () => {
    await watchenzRenderer.setGene(1, "0x00");

    let getGeneBytes = await watchenzRenderer.getGene(1);

    assert.equal(getGeneBytes, "0x00");
    await watchenzRenderer.setGene(1, "0x0102");
    getGeneBytes = await watchenzRenderer.getGene(1);
    assert.equal(getGeneBytes, "0x0102");
  });

  it("WatchenzDataHandler: finalize", async () => {
    // const _MtokenBalance = await Mtoken.balanceOf(MAH.address);
    await watchenzRenderer.set_svg(0, 0, "a-data", "a-title");

    let getDataString = await watchenzRenderer.get_svg(0, 0);
    let gettitleString = await watchenzRenderer.get_title(0, 0);
    assert.equal(getDataString, "a-data");
    assert.equal(gettitleString, "a-title");
    await watchenzRenderer.finalizeSVG();
    expect(
      watchenzRenderer.set_svg(0, 0, "b-data", "b-title")
    ).to.be.revertedWith("svg has been finalized");
    //-
    expect(watchenzRenderer.setGene(1, "0x0102")).to.be.revertedWith(
      "svg has been finalized"
    );
    expect(watchenzRenderer.setSVGParts(1, "part-a")).to.be.revertedWith(
      "svg has been finalized"
    );
    expect(watchenzRenderer.setSVGParts(1, "part-a")).to.be.revertedWith(
      "svg has been finalized"
    );
    expect(watchenzRenderer.finalizeSVG()).to.be.revertedWith(
      "svg has been finalized"
    );

    expect(
      watchenzRenderer.setExceptionTokens([1, 2], [2, 3])
    ).to.be.revertedWith("svg has been finalized");
  });

  it("WatchenzRenderer: setTimeAPI", async () => {
    // const _MtokenBalance = await Mtoken.balanceOf(MAH.address);
    await watchenzRenderer.setTimeAPI("API-Time");

    let apiTime = await watchenzRenderer.getTimeAPI();
    assert.equal(apiTime, "API-Time");
  });
  it("WatchenzRenderer: setWeatherAPI", async () => {
    // const _MtokenBalance = await Mtoken.balanceOf(MAH.address);
    await watchenzRenderer.setWeatherAPI("API-weather");

    let apiTime = await watchenzRenderer.getWeatherAPI();
    assert.equal(apiTime, "API-weather");
  });

  // maybe onlyOwner
});
