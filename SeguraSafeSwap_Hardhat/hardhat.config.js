require("dotenv").config();
require("@nomicfoundation/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require('@openzeppelin/hardhat-upgrades');


const YOUR_PRIVATE_KEY = process.env.PRIVATE_KEY;
const BSCSCAN_API_KEY = process.env.BSCSCAN_API_KEY;
const BSC_Mainnet = process.env.BSC_MAINNET;
const BSC_Testnet = process.env.BSC_TESTNET;

module.exports = {
  solidity: "0.8.20",
  networks: {
    mainnet: {
      url: BSC_Mainnet,
      accounts: [`0x${YOUR_PRIVATE_KEY}`],
      chainId: 56,
    },
    testnet: {
      url: BSC_Testnet,
      accounts: [`0x${YOUR_PRIVATE_KEY}`],
      chainId: 97,
    }
  },
  bscscan: {
    apiKey: BSCSCAN_API_KEY
  }
};