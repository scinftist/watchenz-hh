require("@nomicfoundation/hardhat-toolbox");
// require("@nomiclabs/hardhat-waffle");npm install --save-dev @nomicfoundation/hardhat-chai-matchers
require("@nomicfoundation/hardhat-chai-matchers");
require("dotenv").config();

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "";
const SEPOLIA_RPC_URL =
  process.env.SEPOLIA_RPC_URL ||
  "https://eth-sepolia.g.alchemy.com/v2/your-api-key";
const PRIVATE_KEY =
  process.env.PRIVATE_KEY ||
  "0x11ee3108a03081fe260ecdc106554d09d9d1209bcafd46942b10e02943effc4a";
const GOERLI_BASE_ETHERSCAN_API_KEY = process.env.BASE_ETHERSCAN_API_KEY || "";

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    baseGoerli: {
      url: "https://goerli.base.org",
      accounts: [PRIVATE_KEY],
      chainId: 84531,
      gasPrice: 2000_000_000,
    },
  },
  etherscan: {
    apiKey: {
      baseGoerli: "6JZBHYBJ3XIH6QMGG66W5YWACUM5CKSMMI",
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
