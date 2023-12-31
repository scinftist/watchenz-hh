const { ethers } = require("hardhat");
const { assert, expect } = require("chai");
const fs = require("fs");
const exp = require("constants");
let _verbose = false;
describe("testing WatchenzToken.sol", () => {
  let watchenzToken, watchenzDB, watchenzRenderer, watchenzChannel;
  let _price = ethers.toBigInt("100000000000000");
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

    if (_verbose) console.log(`setting svgs....`);
    const jj = require("../rarity_finalized/RAW_DATA/Unified_json/SVG_DATA.json");

    partsList = [
      "color_a", //0
      "color_b", //1
      "color_c", //2
      "strap", //3
      "hour_marker", //4
      "minute_marker", //5
      "hands", //6
      "bezel_marker",
      "crownGaurd", //8
      "ref", //9
    ];

    let elements;
    for (let i = 0; i < partsList.length; i++) {
      elements = jj[partsList[i]];
      // console.log(`${elements}`);
      // console.log(` ${Object.keys(elements)}`);
      for (let _KEY in Object.keys(elements)) {
        await watchenzRenderer.set_svg(
          i,
          _KEY,
          elements[_KEY].code,
          elements[_KEY].name
        );
      }
    }
    if (_verbose) console.log(`svgs have been set`);
    // core patrs of Watchenz
    if (_verbose) console.log(`setting SVG_parts....`);
    const jParts = require("../AuxData/SVG_PARTS.json");
    partsKeys = [
      "_svgPart0",
      "_svgPart1",
      "_svgPart2",
      "_svgPart3",
      "_svgPart4",
      "_svgPart5",
      "_svgPart6",
      "_svgPart7",
      "_svgPart8",
      "_svgPart9",
      "_svgPart10",
    ];

    for (let i = 0; i < partsKeys.length; i++) {
      await watchenzRenderer.setSVGParts(i, jParts[partsKeys[i]]);
    }
    //--------
    if (_verbose) console.log(`setting Genes....`);
    const jb = require("../rarity_finalized/Rarity-check/target_folder/GENE_SOURCE.json");
    let elementGene;
    let geneTemp;
    for (let i = 0; i < partsList.length; i++) {
      elementGene = partsList[i] + "_gene";
      geneTemp = "0x" + jb[elementGene];
      await watchenzRenderer.setGene(i, geneTemp);
    }
    if (_verbose) console.log(`Genes has been set`);

    acclist = await ethers.getSigners();
    // for (let i = 1; i < 10; i++) {
    //   console.log(`${await acclist[i].getAddress()}`);
    // }
    if (_verbose) console.log(`setting exception tokenIds...`);
    const fs = require("fs");
    csv_exceptional = fs.readFileSync(
      "./rarity_finalized/Rarity-check/target_folder/exceptional_out.csv"
    );
    //exceptionTokens for nonFungibility
    const _tokenArray = await csv_exceptional
      .toString()
      .split("\n")
      .slice(1, -1);
    let tokenIds = [];
    let safeIds = [];
    let tempVal;
    for (let i = 0; i < _tokenArray.length; i++) {
      // console.log(`${_dataArray}}`);
      tempVal = _tokenArray[i].split(",");
      // console.log(`${temp}`);
      safeIds.push(parseInt(tempVal[0]) + 24000);
      tokenIds.push(tempVal[1]);
    }

    let lenSafeId = safeIds.length;
    for (let i = 0; i < 4; i++) {
      if (lenSafeId >= 25) {
        await watchenzRenderer.setExceptionTokens(
          tokenIds.slice(0 + i * 25, 0 + i * 25 + 25),
          safeIds.slice(0 + i * 25, 0 + i * 25 + 25)
        );
      } else {
        await watchenzRenderer.setExceptionTokens(
          tokenIds.slice(0 + i * 25, 0 + i * 25 + lenSafeId),
          safeIds.slice(0 + i * 25, 0 + i * 25 + lenSafeId)
        );
      }
      lenSafeId = lenSafeId - i * 25;
    }
    if (_verbose) console.log(`exception tokenIds have been set`);

    addresses = [];
    quantities = [];
    _price = await watchenzToken.getPrice();
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

    if (_verbose) console.log(`tokenURI: ${await watchenzToken.tokenURI(1)}`);
    await expect(await watchenzToken.tokenURI(2)).not.to.equal("");
  });

  it("watchenzToken: public mint maxSupply and white list previlaged", async () => {
    let _signer;
    let _quant;
    let _bigQuant;
    // for(let j = 0;j)
    let _maxSupply = Number(await watchenzToken.maxSupply());
    let _supplyOfWhitelist = Number(
      await watchenzToken.numberOfTokenInWhiteList()
    );
    let l100 = parseInt((_maxSupply - _supplyOfWhitelist) / 100);

    let r100 = parseInt((_maxSupply - _supplyOfWhitelist) % 100);

    for (let j = 0; j < l100; j++) {
      _quant = getRandomIntInclusive(23, 100);
      _bigQuant = BigInt(100);
      _signer = await ethers.getSigner(addresses[j % 9]);
      await watchenzToken
        .connect(_signer)
        .mintWatchenz(100, { value: _price * _bigQuant });
    }
    await watchenzToken
      .connect(_signer)
      .mintWatchenz(r100, { value: _price * BigInt(r100) });
    if (_verbose)
      console.log(`total minted: ${await watchenzToken.totalSupply()}`);
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
    let _bal = await ethers.provider.getBalance(watchenzToken.getAddress());
    expect(_bal).not.to.equal(0);
    if (_verbose) console.log(` contract balance before ${_bal}`);
    let _ownerBal = await ethers.provider.getBalance(
      await watchenzToken.owner()
    );
    if (_verbose) console.log(`owner balance before ${_ownerBal}`);
    await watchenzToken
      .connect(await ethers.getSigner(await watchenzToken.owner()))
      .withdrawFunds();
    _bal = await ethers.provider.getBalance(watchenzToken.getAddress());
    if (_verbose) console.log(`contract balance after ${_bal}`);
    _ownerBal = await ethers.provider.getBalance(await watchenzToken.owner());
    if (_verbose) console.log(`owner balance after ${_ownerBal}`);
    await expect(_bal).to.equal(0);
  });

  it("WatchenzToken: Ownables", async () => {
    // let owner = await ethers.getSigners()[0];
    let _signer = await ethers.getSigner(addresses[1 % 9]);
    // ethers.signer.connect(_signer);
    expect(
      watchenzToken.connect(_signer).transferOwnership(addresses[1])
    ).to.be.revertedWith("Ownable: caller is not the owner");

    expect(watchenzToken.connect(_signer).freeze()).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );
    expect(watchenzToken.connect(_signer).setStartTime(100)).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );
    expect(
      watchenzToken.connect(_signer).updateAllMetadata()
    ).to.be.revertedWith("Ownable: caller is not the owner");
    expect(
      watchenzToken.connect(_signer).setMaxSupply(24000)
    ).to.be.revertedWith("Ownable: caller is not the owner");
    expect(
      watchenzToken
        .connect(_signer)
        .setMetadateRenderer(watchenzDB.getAddress())
    ).to.be.revertedWith("Ownable: caller is not the owner");
    expect(
      watchenzToken
        .connect(_signer)
        .setMetadateRenderer(watchenzDB.getAddress())
    ).to.be.revertedWith("Ownable: caller is not the owner");
    expect(watchenzToken.connect(_signer).setPrice(100)).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );
    expect(
      watchenzToken.connect(_signer).removeFromWhitelist(addresses)
    ).to.be.revertedWith("Ownable: caller is not the owner");

    expect(
      watchenzToken.connect(_signer).removeFromWhitelist(addresses)
    ).to.be.revertedWith("Ownable: caller is not the owner");
    expect(
      watchenzToken
        .connect(_signer)
        .removeFromWhitelist(addresses.slice(0, 2), quantities.slice(0, 2))
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("WatchenzRender: Ownables", async () => {
    // let owner = await ethers.getSigners()[0];
    let _signer = await ethers.getSigner(addresses[1 % 9]);
    // ethers.signer.connect(_signer);
    expect(
      watchenzRenderer.connect(_signer).transferOwnership(addresses[1])
    ).to.be.revertedWith("Ownable: caller is not the owner");

    expect(
      watchenzRenderer
        .connect(_signer)
        .set_svg(1, 1, "not owner", "defentliy not  owner")
    ).to.be.revertedWith("Ownable: caller is not the owner");
    expect(watchenzRenderer.connect(_signer).finalizeSVG()).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );

    expect(
      watchenzRenderer.connect(_signer).setGene(1, "0x000102")
    ).to.be.revertedWith("Ownable: caller is not the owner");

    expect(
      watchenzRenderer.connect(_signer).setSVGParts(1, "not a good part")
    ).to.be.revertedWith("Ownable: caller is not the owner");

    expect(
      watchenzRenderer.connect(_signer).setWatchenzDB(watchenzDB.getAddress())
    ).to.be.revertedWith("Ownable: caller is not the owner");

    expect(
      watchenzRenderer.connect(_signer).setTimeAPI("not owner api time")
    ).to.be.revertedWith("Ownable: caller is not the owner");

    expect(
      watchenzRenderer.connect(_signer).setWeatherAPI("not owner wheather time")
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });
  it("WatchenzDB: Ownables", async () => {
    // let owner = await ethers.getSigners()[0];
    let _signer = await ethers.getSigner(addresses[1 % 9]);
    // ethers.signer.connect(_signer);
    expect(
      watchenzDB.connect(_signer).transferOwnership(addresses[1])
    ).to.be.revertedWith("Ownable: caller is not the owner");

    expect(
      watchenzDB.connect(_signer).setTokenContract(watchenzToken.getAddress())
    ).to.be.revertedWith("Ownable: caller is not the owner");

    expect(watchenzDB.connect(_signer).setPrice(666)).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );
  });
  it("WatchenzChannel: Ownables", async () => {
    // let owner = await ethers.getSigners()[0];
    let _signer = await ethers.getSigner(addresses[1 % 9]);
    // ethers.signer.connect(_signer);
    expect(
      watchenzChannel.connect(_signer).transferOwnership(addresses[1])
    ).to.be.revertedWith("Ownable: caller is not the owner");

    expect(
      watchenzChannel.connect(_signer).setDynamicBackGround("random url")
    ).to.be.revertedWith("Ownable: caller is not the owner");

    expect(
      watchenzChannel.connect(_signer).setDynamicDial("another randome url")
    ).to.be.revertedWith("Ownable: caller is not the owner");
    expect(
      watchenzChannel
        .connect(_signer)
        .setLocationParameter(" randome  location")
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  // maybe onlyOwner
});

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}
