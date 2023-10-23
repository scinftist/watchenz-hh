const { ethers, run, network } = require("hardhat");
const { string } = require("hardhat/internal/core/params/argumentTypes");

function sleep(second) {
  return new Promise((resolve) => setTimeout(resolve, second * 1000));
}

// async main
async function main() {
  const fs = require("fs");
  //-----
  const watchenzToken_address = fs
    .readFileSync("deploy/DEPLOYED_ADDRESSES/watchenzToken_ADDRESS.txt")
    .toString();
  const watchenzDB_address = fs
    .readFileSync("deploy/DEPLOYED_ADDRESSES/watchenzDB_ADDRESS.txt")
    .toString();
  const watchenzRenderer__address = fs
    .readFileSync("deploy/DEPLOYED_ADDRESSES/watchenzRenderer_ADDRESS.txt")
    .toString();
  const watchenzChannel_address = fs
    .readFileSync("deploy/DEPLOYED_ADDRESSES/watchenzChannel_ADDRESS.txt")
    .toString();
  //attach to metadatarenderer deployed contract
  const WRfactory = await ethers.getContractFactory("WatchenzRenderer");
  const watchenzRenderer = await WRfactory.attach(watchenzRenderer__address);
  //
  console.log("Attaching WatchenzRenderer Contract...");
  //   await watchenzRenderer.waitForDeployment();
  console.log(
    `Deployed WatchenzRenderer contract to:${await watchenzRenderer.getAddress()}`
  );

  //   await sleep(60);

  console.log(`svgs have been set`);
  // core patrs of Watchenz
  console.log(`setting SVG_parts....`);
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
    await sleep(10);
  }
  console.log(`SVG_parts have been set`);
  //   //--------
}

// main
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
