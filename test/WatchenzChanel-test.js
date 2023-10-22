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

  it("SVG includes right background Dial: set by user", async () => {
    let _signer;
    let _quant;
    let _bigQuant;
    let _backGroundURL = "https://backgroundURL.placeholder/img.jpg";
    let _backIntro = 'id="back-image" href="';
    // for(let j = 0;j)
    // for (let j = 0; j < addresses.length; j++) {
    _quant = getRandomIntInclusive(23, 100);
    _bigQuant = BigInt(_quant);
    _signer = await ethers.getSigner(addresses[1]);
    await watchenzToken
      .connect(_signer)
      .mintWatchenz(_quant, { value: _price * _bigQuant });

    let _renderedSVG = await watchenzRenderer.renderTokenById(1);
    expect(_renderedSVG.includes(_backIntro + _backGroundURL)).to.equal(false);

    let _settingFlag = {
      timeZoneFlag: false,
      //   htmlWrapperFlag: false,
      dynamicBackgroundFlag: true,
      dynamicDialFlag: false,
      locationParameterFlag: false,
    };
    let _setting = {
      timeZone: 0,
      //   htmlWrapper: false,
      dynamicBackground: _backGroundURL,
      dynamicDial: "false",
      locationParameter: "false",
    };

    await watchenzDB
      .connect(_signer)
      .setSetting(1, _setting, _settingFlag, { value: _price * BigInt(0) });
    _renderedSVG = await watchenzRenderer.renderTokenById(1);
    // console.log(`${_renderedSVG}`);
    // console.log(`${await watchenzDB.getSetting(1)}`);
    let _s = await watchenzDB.getSetting(1);
    expect(_s.includes(_backGroundURL)).to.equal(true);

    expect(_renderedSVG.includes(_backIntro + _backGroundURL)).to.equal(true);

    expect(watchenzRenderer.renderTokenById(1)).not.to.equal("");
  });

  it("SVG includes right background Dial: set by user", async () => {
    let _signer;
    let _quant;
    let _bigQuant;
    let _dynamicDial = "https://DynamicDial.placeholder/img.jpg";
    let _dynamicDialIntro = '<image id="bg-image" href="';
    // for(let j = 0;j)
    // for (let j = 0; j < addresses.length; j++) {
    _quant = getRandomIntInclusive(23, 100);
    _bigQuant = BigInt(_quant);
    _signer = await ethers.getSigner(addresses[1]);
    await watchenzToken
      .connect(_signer)
      .mintWatchenz(_quant, { value: _price * _bigQuant });

    let _renderedSVG = await watchenzRenderer.renderTokenById(1);
    expect(_renderedSVG.includes(_dynamicDialIntro + _dynamicDial)).to.equal(
      false
    );

    let _settingFlag = {
      timeZoneFlag: false,
      //   htmlWrapperFlag: false,
      dynamicBackgroundFlag: false,
      dynamicDialFlag: true,
      locationParameterFlag: false,
    };
    let _setting = {
      timeZone: 0,
      //   htmlWrapper: false,
      dynamicBackground: "false",
      dynamicDial: _dynamicDial,
      locationParameter: "false",
    };

    await watchenzDB
      .connect(_signer)
      .setSetting(1, _setting, _settingFlag, { value: _price * BigInt(0) });
    _renderedSVG = await watchenzRenderer.renderTokenById(1);
    // console.log(`${_renderedSVG}`);
    // console.log(`${await watchenzDB.getSetting(1)}`);
    let _s = await watchenzDB.getSetting(1);
    expect(_s.includes(_dynamicDial)).to.equal(true);

    expect(_renderedSVG.includes(_dynamicDialIntro + _dynamicDial)).to.equal(
      true
    );

    expect(watchenzRenderer.renderTokenById(1)).not.to.equal("");
  });

  // maybe onlyOwner
});

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}
