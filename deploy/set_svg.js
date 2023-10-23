const { ethers, run, network } = require("hardhat");
const { string } = require("hardhat/internal/core/params/argumentTypes");

function sleep(second) {
  return new Promise((resolve) => setTimeout(resolve, second * 1000));
}

// async main
async function main() {
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
  //   const watchenzRenderer = await ethers.deployContract("WatchenzRenderer");
  console.log("Deploying WatchenzRenderer Contract...");
  //   await watchenzRenderer.waitForDeployment();
  console.log(
    `Deployed WatchenzRenderer contract to:${await watchenzRenderer.getAddress()}`
  );

  //   await sleep(60);

  console.log(`setting svgs....`);
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
    console.log(`starting ${partsList[i]}`);
    // console.log(`${elements}`);
    // console.log(` ${Object.keys(elements)}`);
    for (let _KEY in Object.keys(elements)) {
      console.log(`starting: ${elements[_KEY].name} key: ${_KEY} mode: ${i}`);

      await watchenzRenderer.set_svg(
        i,
        _KEY,
        elements[_KEY].code,
        elements[_KEY].name
      );
      await sleep(10);
      console.log(`successfully uploaded: ${elements[_KEY].name} `);
    }
    console.log(`successfully uploaded all of: ${partsList[i]}`);
  }
  console.log(`svgs have been set`);
}

// main
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
