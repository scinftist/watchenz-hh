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
  //   const watchenzRenderer = await ethers.deployContract("WatchenzRenderer");
  console.log("Deploying WatchenzRenderer Contract...");
  //   await watchenzRenderer.waitForDeployment();
  console.log(
    `Deployed WatchenzRenderer contract to:${await watchenzRenderer.getAddress()}`
  );

  console.log(`setting exception tokenIds...`);

  csv_exceptional = fs.readFileSync(
    "./rarity_finalized/Rarity-check/target_folder/exceptional_out.csv"
  );
  //exceptionTokens for nonFungibility
  const _tokenArray = await csv_exceptional.toString().split("\n").slice(1, -1);
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
    await sleep(10);
  }
}

// main
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
