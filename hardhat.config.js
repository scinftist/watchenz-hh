require("@nomicfoundation/hardhat-toolbox");
// require("@nomiclabs/hardhat-waffle");npm install --save-dev @nomicfoundation/hardhat-chai-matchers
require("@nomicfoundation/hardhat-chai-matchers");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
};
