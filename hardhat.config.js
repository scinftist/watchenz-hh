require("@nomicfoundation/hardhat-toolbox");
// require("@nomiclabs/hardhat-waffle");npm install --save-dev @nomicfoundation/hardhat-chai-matchers
require("@nomicfoundation/hardhat-chai-matchers");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const BASE_ETHERSCAN_API_KEY = process.env.BASE_ETHERSCAN_API_KEY || "";

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    baseGoerli: {
      url: "https://goerli.base.org",
      accounts: [PRIVATE_KEY],
      chainId: 84531,
      gasPrice: 2_000_000_000,
    },
    MyBase: {
      url: "https://mainnet.base.org",
      accounts: [PRIVATE_KEY],
      chainId: 8453,
    },
  },
  etherscan: {
    apiKey: {
      baseGoerli: BASE_ETHERSCAN_API_KEY,
      MyBase: BASE_ETHERSCAN_API_KEY,
    },
    customChains: [
      {
        network: "baseGoerli",
        chainId: 84531,
        urls: {
          apiURL: "https://api-goerli.basescan.org/api",
          browserURL: "https://goerli.basescan.org/",
        },
      },
      {
        network: "MyBase",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org/",
        },
      },
    ],
    // uncomment this line if you are getting a TypeError: customChains is not iterable
  },

  solidity: "0.8.19",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  gasReporter: {
    enabled: true,
    outputFile: "gas-report.txt",
    noColors: true,
  },
};
