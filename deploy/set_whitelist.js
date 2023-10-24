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

  //attach to metadatarenderer deployed contract
  const WTfactory = await ethers.getContractFactory("WatchenzToken");
  const watchenzToken = await WTfactory.attach(watchenzToken_address);
  //   const watchenzRenderer = await ethers.deployContract("WatchenzRenderer");
  console.log("Deploying watchenzToken Contract...");
  //   await watchenzRenderer.waitForDeployment();
  console.log(
    `Deployed watchenzToken contract to:${await watchenzToken.getAddress()}`
  );

  console.log(`setting WhiteListed accounts..`);
  csv_whitelist = fs.readFileSync("AuxData/WhiteListSnapShot.csv");

  const _dataArray = await csv_whitelist.toString().split("\n");
  let addresses = [];
  let quantities = [];
  let temp;
  for (let i = 0; i < _dataArray.length; i++) {
    // console.log(`${_dataArray}}`);
    temp = _dataArray[i].split(",");
    // console.log(`${temp}`);
    addresses.push(temp[0]);
    quantities.push(parseInt(temp[1]) * 25);
  }
  console.log(`Whitelisted accounts have been statred`);
  await sleep(10);
  await watchenzToken.addToWhitelist(addresses, quantities);
  await sleep(10);
  console.log(`Whitelisted accounts have been set`);
}

// main
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
