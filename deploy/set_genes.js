const { ethers, run, network } = require("hardhat");
const { string } = require("hardhat/internal/core/params/argumentTypes");

function sleep(second) {
  return new Promise((resolve) => setTimeout(resolve, second * 1000));
}

// async main
async function main() {
  const fs = require("fs");
  //-----
  console.log(`setting genes ...`);
  const watchenzRenderer__address = fs
    .readFileSync("deploy/DEPLOYED_ADDRESSES/watchenzRenderer_ADDRESS.txt")
    .toString();

  //attach to metadatarenderer deployed contract
  const WRfactory = await ethers.getContractFactory("WatchenzRenderer");
  const watchenzRenderer = await WRfactory.attach(watchenzRenderer__address);
  //   const watchenzRenderer = await ethers.deployContract("WatchenzRenderer");
  console.log("Attaching WatchenzRenderer Contract...");
  //   await watchenzRenderer.waitForDeployment();
  console.log(
    `Deployed WatchenzRenderer contract to:${await watchenzRenderer.getAddress()}`
  );

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

  //--------
  console.log(`setting Genes....`);
  const jb = require("../rarity_finalized/Rarity-check/target_folder/GENE_SOURCE.json");
  let elementGene;
  let geneTemp;
  for (let i = 0; i < partsList.length; i++) {
    elementGene = partsList[i] + "_gene";
    console.log(`uploading : ${elementGene}`);
    geneTemp = "0x" + jb[elementGene];
    await watchenzRenderer.setGene(i, geneTemp);
    console.log(` ${elementGene} has been uploaded.`);
    await sleep(10);
  }
  console.log(`Genes has been set`);
}

// main
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
