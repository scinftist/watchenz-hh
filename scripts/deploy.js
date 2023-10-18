// imports
const { ethers, run, network } = require("hardhat");
const { string } = require("hardhat/internal/core/params/argumentTypes");

// async main
async function main() {
  const watchenzToken = await ethers.deployContract("WatchenzToken");
  console.log("Deploying WatchenzToken Contract ...");
  await watchenzToken.waitForDeployment();
  console.log(
    `Deployed WatchenzToken contract to:${await watchenzToken.getAddress()}`
  );
  //-----
  const watchenzDB = await ethers.deployContract("WatchenzDB");
  console.log("Deploying WatchenzDB Contract...");
  await watchenzDB.waitForDeployment();
  console.log(
    `Deployed WatchenzDB contract to:${await watchenzDB.getAddress()}`
  );
  //-----
  const watchenzRenderer = await ethers.deployContract("WatchenzRenderer");
  console.log("Deploying WatchenzRenderer Contract...");
  await watchenzRenderer.waitForDeployment();
  console.log(
    `Deployed WatchenzRenderer contract to:${await watchenzRenderer.getAddress()}`
  );

  //-----
  const watchenzChannel = await ethers.deployContract("WatchenzChannel");
  console.log("Deploying watchenzChannel Contract...");
  await watchenzChannel.waitForDeployment();
  console.log(
    `Deployed watchenzChannel contract to:${await watchenzChannel.getAddress()}`
  );

  //---set WatchenzToken
  await watchenzToken.setDB(watchenzDB.getAddress());
  console.log(`getDB ${await watchenzToken.getDB()}`);
  await watchenzToken.setMetadateRenderer(watchenzRenderer.getAddress());
  console.log(
    `getMetadataRenderer ${await watchenzToken.getMetadataRenderer()}`
  );

  //--- set WatchenzDB
  await watchenzDB.setTokenContract(watchenzToken.getAddress());
  console.log(`getTokenContract ${await watchenzDB.getTokenContract()}`);

  //
  await watchenzRenderer.setWatchenzDB(watchenzDB.getAddress());
  console.log(
    `getWatchenzDB contract ${await watchenzRenderer.getWatchenzDB()}`
  );
  //--
  await watchenzDB.setChannelContract(watchenzChannel.getAddress());
  console.log(
    `getChannelContract contract ${await watchenzDB.getChannelContract()}`
  );

  // const jj = require("../AuxData/data.json");

  const jj = require("../rarity_finalized/RAW_DATA/Unified_json/SVG_DATA.json");
  // rarity_finalized/RAW_DATA/Unified_json/SVG_DATA.json
  console.log(jj["color_a"], "the json obj");
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
  // crown_gaurd
  // let tt = JSON.parse(jj);
  // console.log(`haw${partsList[1]}`);

  let elements;
  for (let i = 0; i < partsList.length - 2; i++) {
    // str = str + i;
    elements = jj[partsList[i]];
    console.log(`${elements}`);
    console.log(` ${Object.keys(elements)}`);
    for (let _KEY in Object.keys(elements)) {
      await watchenzRenderer.set_svg(
        i,
        _KEY,
        elements[_KEY].code,
        elements[_KEY].name
      );
    }
  }

  // rarity_finalized/Rarity-check/target_folder/GENE_SOURCE.json
  const jb = require("../rarity_finalized/Rarity-check/target_folder/GENE_SOURCE.json");
  let elementGene;
  let geneTemp;
  for (let i = 0; i < partsList.length; i++) {
    // str = str + i;

    elementGene = partsList[i] + "_gene";
    // console.log(`${elements}`);
    // console.log(` ${Object.keys(elements)}`);
    // console.log(`${jb[elements]}`);
    geneTemp = "0x" + jb[elementGene];
    console.log(`${elementGene}  ${jb[elementGene].length / 2}`);
    console.log(`${geneTemp}`);
    await watchenzRenderer.setGene(i, geneTemp);
  }
  console.log(`generate SVG`);
  console.log(`${await watchenzRenderer.renderTokenById(1)}`);
  acclist = await ethers.getSigners();
  for (let i = 1; i < 10; i++) {
    console.log(`${await acclist[i].getAddress()}`);
  }
  console.log(`genome ${await watchenzRenderer.getGenome(1)}`);

  const fs = require("fs");
  csv = fs.readFileSync("AuxData/WhiteList.csv");
  // AuxData/WhiteList.csv
  console.log(`${csv}}`);
  const _dataArray = await csv.toString().split("\n");
  let addresses = [];
  let quantities = [];
  let temp;
  for (let i = 0; i < _dataArray.length; i++) {
    // console.log(`${_dataArray}}`);
    temp = _dataArray[i].split(",");
    // console.log(`${temp}`);
    addresses.push(temp[0]);
    quantities.push(temp[1]);
  }
  console.log(`${quantities}`);

  for (let i = 0; i < 1; i++) {
    await watchenzToken.addToWhitelist(addresses, quantities);
  }

  console.log(
    ` 5 ${await watchenzToken.getWhitelistQuantity(
      "0x90f79bf6eb2c4f870365e785982e1f101e93b906"
    )}`
  );
  console.log(
    `8 ${await watchenzToken.getWhitelistQuantity(
      "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc"
    )}`
  );
  // let acclist, _signer;
  // acclist = await ethers.getSigners();
  _signer = acclist[1];
  await watchenzToken.connect(_signer).whitelistMint();
  console.log(`sss`);
  console.log(`whattttttt ${await watchenzToken.tokenURI(1)}`);

  console.log(`fucccccccccck ${"hi".length}`);
}

// main
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
