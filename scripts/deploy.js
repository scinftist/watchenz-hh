// imports
const { ethers, run, network } = require("hardhat");

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

  //---set WatchenzToken
  await watchenzToken.setDB(watchenzDB.getAddress());
  console.log(`getDB ${await watchenzToken.getDB()}`);
  await watchenzToken.setMetadateRenderer(watchenzDB.getAddress());
  console.log(
    `getMetadataRenderer ${await watchenzToken.getMetadataRenderer()}`
  );

  //---
  await watchenzDB.setTokenContract(watchenzToken.getAddress());
  console.log(`getTokenContract ${await watchenzDB.getTokenContract()}`);
}

// main
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
