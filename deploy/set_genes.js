const { ethers, run, network } = require("hardhat");
const { string } = require("hardhat/internal/core/params/argumentTypes");

function sleep(second) {
  return new Promise((resolve) => setTimeout(resolve, second * 1000));
}

// async main
async function main() {
  //-----
  const WRfactory = await ethers.getContractFactory("WatchenzRenderer");
  const watchenzRenderer = await WRfactory.attach(
    "0x9055Cc3d312F2301Bc8c6F3106160fA9730baB2A"
  );
  //   const watchenzRenderer = await ethers.deployContract("WatchenzRenderer");
  console.log("Deploying WatchenzRenderer Contract...");
  //   await watchenzRenderer.waitForDeployment();
  console.log(
    `Deployed WatchenzRenderer contract to:${await watchenzRenderer.getAddress()}`
  );

  //   await sleep(60);

  // console.log(`setting svgs....`);
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
  // for (let i = 0; i < partsList.length; i++) {
  elements = jj[partsList[9]];
  console.log(`starting ${partsList[9]}`);
  // console.log(`${elements}`);
  // console.log(` ${Object.keys(elements)}`);
  // for (let _KEY in Object.keys(elements)) {
  // await sleep(10);
  await watchenzRenderer.set_svg(9, 2, elements[2].code, elements[2].name);
  // }
  // console.log(`svgs have been set`);
  // // core patrs of Watchenz
  // console.log(`setting SVG_parts....`);
  // const jParts = require("../AuxData/SVG_PARTS.json");
  // partsKeys = [
  //   "_svgPart0",
  //   "_svgPart1",
  //   "_svgPart2",
  //   "_svgPart3",
  //   "_svgPart4",
  //   "_svgPart5",
  //   "_svgPart6",
  //   "_svgPart7",
  //   "_svgPart8",
  //   "_svgPart9",
  //   "_svgPart10",
  // ];

  // for (let i = 0; i < partsKeys.length; i++) {
  //   await watchenzRenderer.setSVGParts(i, jParts[partsKeys[i]]);
  //   await sleep(10);
  // }
  // console.log(`SVG_parts have been set`);
  //--------
  console.log(`setting Genes....`);
  const jb = require("../rarity_finalized/Rarity-check/target_folder/GENE_SOURCE.json");
  let elementGene;
  let geneTemp;
  for (let i = 0; i < partsList.length; i++) {
    await sleep(10);
    elementGene = partsList[i] + "_gene";
    geneTemp = "0x" + jb[elementGene];
    await watchenzRenderer.setGene(i, geneTemp);
  }
  console.log(`Genes has been set`);

  //   acclist = await ethers.getSigners();
  //   // for (let i = 1; i < 10; i++) {
  //   //   console.log(`${await acclist[i].getAddress()}`);
  //   // }
  //   console.log(`setting exception tokenIds...`);
  //   const fs = require("fs");
  //   csv_exceptional = fs.readFileSync(
  //     "./rarity_finalized/Rarity-check/target_folder/exceptional_out.csv"
  //   );
  //   //exceptionTokens for nonFungibility
  //   const _tokenArray = await csv_exceptional.toString().split("\n").slice(1, -1);
  //   let tokenIds = [];
  //   let safeIds = [];
  //   let tempVal;
  //   for (let i = 0; i < _tokenArray.length; i++) {
  //     // console.log(`${_dataArray}}`);
  //     tempVal = _tokenArray[i].split(",");
  //     // console.log(`${temp}`);
  //     safeIds.push(parseInt(tempVal[0]) + 24000);
  //     tokenIds.push(tempVal[1]);
  //   }

  //   let lenSafeId = safeIds.length;
  //   for (let i = 0; i < 4; i++) {
  //     if (lenSafeId >= 25) {
  //       await sleep(10);
  //       await watchenzRenderer.setExceptionTokens(
  //         tokenIds.slice(0 + i * 25, 0 + i * 25 + 25),
  //         safeIds.slice(0 + i * 25, 0 + i * 25 + 25)
  //       );
  //     } else {
  //       await watchenzRenderer.setExceptionTokens(
  //         tokenIds.slice(0 + i * 25, 0 + i * 25 + lenSafeId),
  //         safeIds.slice(0 + i * 25, 0 + i * 25 + lenSafeId)
  //       );
  //     }
  //     lenSafeId = lenSafeId - i * 25;
  //   }
  //   console.log(`exception tokenIds have been set`);
  //   console.log(`setting WhiteListed accounts..`);
  //   csv_whitelist = fs.readFileSync("AuxData/WhiteList.csv");
  //   // AuxData/WhiteList.csv

  //   const _dataArray = await csv_whitelist.toString().split("\n");
  //   let addresses = [];
  //   let quantities = [];
  //   let temp;
  //   for (let i = 0; i < _dataArray.length; i++) {
  //     // console.log(`${_dataArray}}`);
  //     temp = _dataArray[i].split(",");
  //     // console.log(`${temp}`);
  //     addresses.push(temp[0]);
  //     quantities.push(temp[1]);
  //   }

  //   // if error has been raise break it in to smaller transactions
  //   for (let i = 0; i < 1; i++) {
  //     await sleep(10);
  //     await watchenzToken.addToWhitelist(addresses, quantities);
  //   }
  //   console.log(`Whitelisted accounts have been set`);

  //   // let acclist, _signer;
  //   // acclist = await ethers.getSigners();

  //   // console.log(`sss`);
  //   console.log(`whattttttt\n ${await watchenzToken.tokenURI(1)}`);

  // yarn ins
}

// main
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
