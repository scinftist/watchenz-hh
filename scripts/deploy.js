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

  //---set WatchenzToken
  await watchenzToken.setDB(watchenzDB.getAddress());
  console.log(`getDB ${await watchenzToken.getDB()}`);
  await watchenzToken.setMetadateRenderer(watchenzDB.getAddress());
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
  //

  console.log(`generate SVG`);
  console.log(`${await watchenzRenderer.renderTokenById(1)}`);
  //----
  const jj = require("../AuxData/data.json");
  console.log(jj["color_a"], "the json obj");
  partsList = [
    "color_a", //0
    "color_b",
    "color_c",
    "strap", //3
    "dial_indicator",
    "micro_inidcator",
    "hands", //6
    "bezel_indicator",
  ];
  // let tt = JSON.parse(jj);
  // console.log(`haw${partsList[1]}`);
  let elements;
  for (let i = 0; i < partsList.length; i++) {
    // str = str + i;
    elements = jj[partsList[i]];
    // console.log(`${elements}`);
    // console.log(` ${Object.keys(elements)}`);
    for (let _KEY in Object.keys(elements)) {
      console.log(`${_KEY}`);
      console.log(`${elements[_KEY].data}`);
      await watchenzRenderer.set_svg(
        i,
        _KEY,
        elements[_KEY].data,
        elements[_KEY].title
      );
    }
  }
  console.log(`generate SVG`);
  console.log(`${await watchenzRenderer.renderTokenById(1)}`);
}

// main
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
