// imports
const { ethers, run, network } = require("hardhat");

// async main
async function main() {
  const watchenz = await ethers.deployContract("Watchenz");
  console.log("Deploying Contract...");
  await watchenz.waitForDeployment();
  console.log(`Deployed contract to:${await watchenz.getAddress()}`);
}

// main
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
