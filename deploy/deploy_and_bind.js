const { ethers, run, network } = require("hardhat");
const { string } = require("hardhat/internal/core/params/argumentTypes");

const verify = async (contractAddress, args) => {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified!");
    } else {
      console.log(e);
    }
  }
};

const _verify = true;

function sleep(second) {
  return new Promise((resolve) => setTimeout(resolve, second * 1000));
}

// async main
async function main() {
  const fs = require("fs");

  //deploying watchenzToken.sol
  const watchenzToken = await ethers.deployContract("WatchenzToken");
  console.log("Deploying WatchenzToken Contract ...");
  await watchenzToken.waitForDeployment();
  console.log(
    `Deployed WatchenzToken contract to:${await watchenzToken.getAddress()}`
  );

  fs.writeFile(
    "deploy/DEPLOYED_ADDRESSES/watchenzToken_ADDRESS.txt",
    await watchenzToken.getAddress(),
    (err) => {
      // In case of a error throw err.
      if (err) throw err;
    }
  );
  if (_verify) await verify(await watchenzToken.getAddress(), []);
  await sleep(60); // so the API does not overheat :p
  //-----
  //deploying watchenzDB.sol
  const watchenzDB = await ethers.deployContract("WatchenzDB");
  console.log("Deploying WatchenzDB Contract...");
  await watchenzDB.waitForDeployment();
  console.log(
    `Deployed WatchenzDB contract to:${await watchenzDB.getAddress()}`
  );
  fs.writeFile(
    "deploy/DEPLOYED_ADDRESSES/watchenzDB_ADDRESS.txt",
    await watchenzDB.getAddress(),
    (err) => {
      // In case of a error throw err.
      if (err) throw err;
    }
  );
  if (_verify) await verify(await watchenzDB.getAddress(), []);
  await sleep(60); // so the API does not overheat :p
  //-----
  //deploying watchenzRenderer.sol
  const watchenzRenderer = await ethers.deployContract("WatchenzRenderer");
  console.log("Deploying WatchenzRenderer Contract...");
  await watchenzRenderer.waitForDeployment();
  console.log(
    `Deployed WatchenzRenderer contract to:${await watchenzRenderer.getAddress()}`
  );
  fs.writeFile(
    "deploy/DEPLOYED_ADDRESSES/watchenzRenderer_ADDRESS.txt",
    await watchenzRenderer.getAddress(),
    (err) => {
      // In case of a error throw err.
      if (err) throw err;
    }
  );
  if (_verify) await verify(await watchenzRenderer.getAddress(), []);
  await sleep(60); // so the API does not overheat :p

  //-----
  //deploying watchenzRenderer.sol
  const watchenzChannel = await ethers.deployContract("WatchenzChannel");
  console.log("Deploying watchenzChannel Contract...");
  await watchenzChannel.waitForDeployment();
  console.log(
    `Deployed watchenzChannel contract to:${await watchenzChannel.getAddress()}`
  );
  fs.writeFile(
    "deploy/DEPLOYED_ADDRESSES/watchenzChannel_ADDRESS.txt",
    await watchenzChannel.getAddress(),
    (err) => {
      // In case of a error throw err.
      if (err) throw err;
    }
  );
  if (_verify) await verify(await watchenzChannel.getAddress(), []);
  await sleep(60); // so the API does not overheat :p
  //----

  //---set WatchenzToken

  await watchenzToken.setDB(watchenzDB.getAddress());
  console.log(`getDB ${await watchenzToken.getDB()}`);
  await watchenzToken.setMetadateRenderer(watchenzRenderer.getAddress());
  console.log(
    `getMetadataRenderer ${await watchenzToken.getMetadataRenderer()}`
  );
  await sleep(10);
  //--- set WatchenzDB
  await watchenzDB.setTokenContract(watchenzToken.getAddress());
  console.log(`getTokenContract ${await watchenzDB.getTokenContract()}`);
  //--

  await watchenzDB.setChannelContract(watchenzChannel.getAddress());
  console.log(
    `getChannelContract contract ${await watchenzDB.getChannelContract()}`
  );
  await sleep(10);
  //--- set watchenzRenderer
  await watchenzRenderer.setWatchenzDB(watchenzDB.getAddress());
  console.log(
    `getWatchenzDB contract ${await watchenzRenderer.getWatchenzDB()}`
  );
  await sleep(10);
}

// main
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// const WRfactory = await ethers.getContractFactory("WatchenzRenderer");
// const watchenzRenderer = await WRfactory.attach(
//   "0x9055Cc3d312F2301Bc8c6F3106160fA9730baB2A"
// );

// const WDBfactory = await ethers.getContractFactory("WatchenzRenderer");
// const watchenzDB = await WDBfactory.attach(
//   "0x80d68f010035740c0ce40ED7abC09E7928c58703"
// );

// const WCHfactory = await ethers.getContractFactory("WatchenzRenderer");
// const watchenzChannel = await WCHfactory.attach(
//   "0x04E2553aFAB4e3E18Fe754F8dA8b3De881fDE4AC"
// );
