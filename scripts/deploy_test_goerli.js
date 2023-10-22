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
// async main
async function main() {
  const watchenzToken = await ethers.deployContract("WatchenzToken");
  console.log("Deploying WatchenzToken Contract ...");
  await watchenzToken.waitForDeployment();
  console.log(
    `Deployed WatchenzToken contract to:${await watchenzToken.getAddress()}`
  );

  await verify(await watchenzToken.getAddress(), []);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
