const { ethers } = require("hardhat");
const { assert, expect } = require("chai");
const fs = require("fs");
const exp = require("constants");
let _verbose = false;
describe("testing WatchenzDB.sol and WatchenzChannel.sol", () => {
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
      tempVal = _tokenArray[i].split(",");

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

    _servicePrices = [
      ethers.toBigInt("1000000"),
      ethers.toBigInt("2000000"),
      ethers.toBigInt("3000000"),
      ethers.toBigInt("4000000"),
    ];
    for (let i = 0; i < 4; i++) {
      await watchenzDB.setPrice(i, _servicePrices[i]);
    }
  });

  it("SVG includes right background Dial: set by user", async () => {
    let _signer;
    let _quant;
    let _bigQuant;
    let _backGroundURL = "https://backgroundURL.placeholder/img.jpg";
    let _backIntro = 'id="back-image" href="';
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
      dynamicBackgroundFlag: true,
      dynamicDialFlag: false,
      locationParameterFlag: false,
    };
    let _setting = {
      timeZone: 0,
      dynamicBackground: _backGroundURL,
      dynamicDial: "false",
      locationParameter: "false",
    };
    await expect(
      watchenzDB
        .connect(_signer)
        .setSetting(1, _setting, _settingFlag, { value: BigInt(0) })
    ).to.be.revertedWith("wrong value of ETH");

    await watchenzDB
      .connect(_signer)
      .setSetting(1, _setting, _settingFlag, { value: _servicePrices[1] });
    _renderedSVG = await watchenzRenderer.renderTokenById(1);

    let _s = await watchenzDB.getSetting(1);
    expect(_s.includes(_backGroundURL)).to.equal(true);

    expect(_renderedSVG.includes(_backIntro + _backGroundURL)).to.equal(true);

    expect(await watchenzRenderer.renderTokenById(1)).not.to.equal("");
  });

  it("SVG includes right Dynamic Dial: set by user", async () => {
    let _signer;
    let _quant;
    let _bigQuant;
    let _dynamicDial = "https://DynamicDial.placeholder/img.jpg";
    let _dynamicDialIntro = '<image id="bg-image" href="';

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
      dynamicBackgroundFlag: false,
      dynamicDialFlag: true,
      locationParameterFlag: false,
    };
    let _setting = {
      timeZone: 0,
      dynamicBackground: "false",
      dynamicDial: _dynamicDial,
      locationParameter: "false",
    };

    await expect(
      watchenzDB
        .connect(_signer)
        .setSetting(1, _setting, _settingFlag, { value: BigInt(0) })
    ).to.be.revertedWith("wrong value of ETH");

    await watchenzDB
      .connect(_signer)
      .setSetting(1, _setting, _settingFlag, { value: _servicePrices[2] });
    _renderedSVG = await watchenzRenderer.renderTokenById(1);
    let _s = await watchenzDB.getSetting(1);
    expect(_s.includes(_dynamicDial)).to.equal(true);

    expect(_renderedSVG.includes(_dynamicDialIntro + _dynamicDial)).to.equal(
      true
    );

    expect(await watchenzRenderer.renderTokenById(1)).not.to.equal("");
  });

  it("SVG includes right _location: set by user", async () => {
    let _signer;
    let _quant;
    let _bigQuant;
    let _location = "home, bitter, Home";
    let _locationIntro = ',_location="';

    _quant = getRandomIntInclusive(23, 100);
    _bigQuant = BigInt(_quant);
    _signer = await ethers.getSigner(addresses[1]);
    await watchenzToken
      .connect(_signer)
      .mintWatchenz(_quant, { value: _price * _bigQuant });

    let _renderedSVG = await watchenzRenderer.renderTokenById(1);
    expect(_renderedSVG.includes(_locationIntro + _location)).to.equal(false);

    let _settingFlag = {
      timeZoneFlag: false,
      dynamicBackgroundFlag: false,
      dynamicDialFlag: false,
      locationParameterFlag: true,
    };
    let _setting = {
      timeZone: 0,
      dynamicBackground: "false",
      dynamicDial: "false",
      locationParameter: _location,
    };

    await expect(
      watchenzDB
        .connect(_signer)
        .setSetting(1, _setting, _settingFlag, { value: BigInt(0) })
    ).to.be.revertedWith("wrong value of ETH");

    await watchenzDB
      .connect(_signer)
      .setSetting(1, _setting, _settingFlag, { value: _servicePrices[3] });
    _renderedSVG = await watchenzRenderer.renderTokenById(1);

    let _s = await watchenzDB.getSetting(1);
    expect(_s.includes(_location)).to.equal(true);

    expect(_renderedSVG.includes(_locationIntro + _location)).to.equal(true);

    expect(await watchenzRenderer.renderTokenById(1)).not.to.equal("");
  });
  it("SVG includes right timeZone: set by user", async () => {
    let _signer;
    let _quant;
    let _bigQuant;

    let _time = "1234";
    let _timeIntro = ",_offSet=";

    _quant = getRandomIntInclusive(23, 100);
    _bigQuant = BigInt(_quant);
    _signer = await ethers.getSigner(addresses[1]);
    await watchenzToken
      .connect(_signer)
      .mintWatchenz(_quant, { value: _price * _bigQuant });

    let _renderedSVG = await watchenzRenderer.renderTokenById(1);
    expect(await _renderedSVG.includes(_timeIntro + _time)).to.equal(false);

    let _settingFlag = {
      timeZoneFlag: true,
      dynamicBackgroundFlag: false,
      dynamicDialFlag: false,
      locationParameterFlag: false,
    };
    let _setting = {
      timeZone: 1234,
      dynamicBackground: "false",
      dynamicDial: "false",
      locationParameter: "false",
    };

    await expect(
      watchenzDB
        .connect(_signer)
        .setSetting(1, _setting, _settingFlag, { value: BigInt(0) })
    ).to.be.revertedWith("wrong value of ETH");

    await watchenzDB
      .connect(_signer)
      .setSetting(1, _setting, _settingFlag, { value: _servicePrices[0] });
    _renderedSVG = await watchenzRenderer.renderTokenById(1);

    let _s = await watchenzDB.getSetting(1);

    expect(_renderedSVG.includes(_timeIntro + _time)).to.equal(true);

    expect(await watchenzRenderer.renderTokenById(1)).not.to.equal("");
  });
  it("SVG includes right setting: set by user", async () => {
    let _signer;
    let _quant;
    let _bigQuant;

    let _time = "1234";
    let _timeIntro = ",_offSet=";
    let _location = "home, bitter, Home";
    let _locationIntro = ',_location="';
    let _dynamicDial = "https://DynamicDial.placeholder/img.jpg";
    let _dynamicDialIntro = '<image id="bg-image" href="';
    let _backGroundURL = "https://backgroundURL.placeholder/img.jpg";
    let _backIntro = 'id="back-image" href="';

    _quant = getRandomIntInclusive(23, 100);
    _bigQuant = BigInt(_quant);
    _signer = await ethers.getSigner(addresses[1]);
    await watchenzToken
      .connect(_signer)
      .mintWatchenz(_quant, { value: _price * _bigQuant });

    let _renderedSVG = await watchenzRenderer.renderTokenById(1);
    expect(await _renderedSVG.includes(_timeIntro + _time)).to.equal(false);

    let _settingFlag = {
      timeZoneFlag: true,
      dynamicBackgroundFlag: true,
      dynamicDialFlag: true,
      locationParameterFlag: true,
    };
    let _setting = {
      timeZone: 1234,
      dynamicBackground: _backGroundURL,
      dynamicDial: _dynamicDial,
      locationParameter: _location,
    };

    await expect(
      watchenzDB
        .connect(_signer)
        .setSetting(1, _setting, _settingFlag, { value: BigInt(0) })
    ).to.be.revertedWith("wrong value of ETH");

    await watchenzDB.connect(_signer).setSetting(1, _setting, _settingFlag, {
      value:
        _servicePrices[0] +
        _servicePrices[1] +
        _servicePrices[2] +
        _servicePrices[3],
    });
    _renderedSVG = await watchenzRenderer.renderTokenById(1);

    let _s = await watchenzDB.getSetting(1);

    expect(_renderedSVG.includes(_timeIntro + _time)).to.equal(true);

    _renderedSVG = await watchenzRenderer.renderTokenById(1);

    _s = await watchenzDB.getSetting(1);
    expect(_s.includes(_location)).to.equal(true);

    expect(_renderedSVG.includes(_locationIntro + _location)).to.equal(true);

    _s = await watchenzDB.getSetting(1);
    expect(_s.includes(_dynamicDial)).to.equal(true);

    _s = await watchenzDB.getSetting(1);
    expect(_s.includes(_backGroundURL)).to.equal(true);

    expect(_renderedSVG.includes(_backIntro + _backGroundURL)).to.equal(true);

    expect(_renderedSVG.includes(_dynamicDialIntro + _dynamicDial)).to.equal(
      true
    );
    // withdraw check is a cherry on top i'm tierd
    let _bal = await ethers.provider.getBalance(watchenzDB.getAddress());
    expect(_bal).not.to.equal(0);
    if (_verbose) console.log(` contract balance before ${_bal}`);
    let _ownerBal = await ethers.provider.getBalance(await watchenzDB.owner());
    if (_verbose) console.log(`owner balance before ${_ownerBal}`);
    await watchenzDB
      .connect(await ethers.getSigner(await watchenzDB.owner()))
      .withdrawFunds();
    _bal = await ethers.provider.getBalance(watchenzDB.getAddress());
    if (_verbose) console.log(`contract balance after ${_bal}`);
    _ownerBal = await ethers.provider.getBalance(await watchenzDB.owner());
    if (_verbose) console.log(`owner balance after ${_ownerBal}`);
    await expect(_bal).to.equal(0);
    if (_verbose)
      console.log(`final svg after :\n ${await watchenzToken.tokenURI(1)} `);
    expect(await watchenzRenderer.renderTokenById(1)).not.to.equal("");
  });
  it("SVG includes right setting: set by Channel", async () => {
    let _signer;
    let _quant;
    let _bigQuant;

    let _time = "1234";
    let _timeIntro = ",_offSet=";
    let _location = "home, bitter, Home";
    let _locationIntro = ',_location="';
    let _dynamicDial = "https://DynamicDial.placeholder/img.jpg";
    let _dynamicDialIntro = '<image id="bg-image" href="';
    let _backGroundURL = "https://backgroundURL.placeholder/img.jpg";
    let _backIntro = 'id="back-image" href="';

    _quant = getRandomIntInclusive(23, 100);
    _bigQuant = BigInt(_quant);
    _signer = await ethers.getSigner(addresses[1]);
    await watchenzToken
      .connect(_signer)
      .mintWatchenz(_quant, { value: _price * _bigQuant });

    let _renderedSVG = await watchenzRenderer.renderTokenById(1);
    expect(await _renderedSVG.includes(_timeIntro + _time)).to.equal(false);

    let _settingFlag = {
      timeZoneFlag: true,
      dynamicBackgroundFlag: true,
      dynamicDialFlag: true,
      locationParameterFlag: true,
    };
    let _setting = {
      timeZone: 1234,
      dynamicBackground: _backGroundURL,
      dynamicDial: _dynamicDial,
      locationParameter: _location,
    };

    await expect(
      watchenzDB
        .connect(_signer)
        .setSetting(1, _setting, _settingFlag, { value: BigInt(0) })
    ).to.be.revertedWith("wrong value of ETH");

    await watchenzDB.connect(_signer).setSetting(1, _setting, _settingFlag, {
      value:
        _servicePrices[0] +
        _servicePrices[1] +
        _servicePrices[2] +
        _servicePrices[3],
    });
    _renderedSVG = await watchenzRenderer.renderTokenById(1);

    let _s = await watchenzDB.getSetting(1);

    expect(_renderedSVG.includes(_timeIntro + _time)).to.equal(true);

    _renderedSVG = await watchenzRenderer.renderTokenById(1);

    _s = await watchenzDB.getSetting(1);
    expect(_s.includes(_location)).to.equal(true);

    expect(_renderedSVG.includes(_locationIntro + _location)).to.equal(true);

    _s = await watchenzDB.getSetting(1);
    expect(_s.includes(_dynamicDial)).to.equal(true);

    _s = await watchenzDB.getSetting(1);
    expect(_s.includes(_backGroundURL)).to.equal(true);

    expect(_renderedSVG.includes(_backIntro + _backGroundURL)).to.equal(true);

    expect(_renderedSVG.includes(_dynamicDialIntro + _dynamicDial)).to.equal(
      true
    );

    expect(await watchenzRenderer.renderTokenById(1)).not.to.equal("");

    _settingFlag = {
      timeZoneFlag: true,
      dynamicBackgroundFlag: true,
      dynamicDialFlag: true,
      locationParameterFlag: true,
    };
    _setting = {
      timeZone: 1234,
      dynamicBackground: "",
      dynamicDial: "",
      locationParameter: "",
    };

    await expect(
      watchenzDB
        .connect(_signer)
        .setSetting(1, _setting, _settingFlag, { value: BigInt(0) })
    ).to.be.revertedWith("wrong value of ETH");

    await watchenzDB.connect(_signer).setSetting(1, _setting, _settingFlag, {
      value:
        _servicePrices[0] +
        _servicePrices[1] +
        _servicePrices[2] +
        _servicePrices[3],
    });
    let _ownerChannel = await watchenzChannel.owner();
    _signer = await ethers.getSigner(_ownerChannel);
    let channelDial = "4 dial channel";
    let channelBackground = "4 back channel";
    let channelLocation = "4 location channel";
    await watchenzChannel.connect(_signer).setDynamicDial(channelDial);
    await watchenzChannel
      .connect(_signer)
      .setDynamicBackGround(channelBackground);
    await watchenzChannel
      .connect(_signer)
      .setLocationParameter(channelLocation);

    _renderedSVG = await watchenzRenderer.renderTokenById(1);

    _s = await watchenzDB.getSetting(1);

    expect(_s.includes(channelDial)).to.equal(true);
    expect(_s.includes(channelBackground)).to.equal(true);
    expect(_s.includes(channelLocation)).to.equal(true);

    expect(_renderedSVG.includes(_dynamicDialIntro + channelDial)).to.equal(
      true
    );
    expect(_renderedSVG.includes(_backIntro + channelBackground)).to.equal(
      true
    );
    expect(_renderedSVG.includes(_locationIntro + channelLocation)).to.equal(
      true
    );
  });
});

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}
