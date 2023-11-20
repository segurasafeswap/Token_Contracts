async function main() {
  require('dotenv').config();
  const { ethers, upgrades } = require("hardhat");

  const minterAddress = process.env.MINTER_ADDRESS;
  const pauserAddress = process.env.PAUSER_ADDRESS;
  const vetoerAddress = process.env.VETOER_ADDRESS;
  const initialSupply = ethers.parseUnits('250000000', 18);

  console.log("Starting deployment...");

  // Deploy the logic contract and proxy, and initialize the proxy
  const SeguraSafeSwapToken = await ethers.getContractFactory("SeguraSafeSwapToken");
  console.log("Contract factory loaded");

  try {
      const tokenInstance = await upgrades.deployProxy(SeguraSafeSwapToken, [initialSupply], { initializer: 'initialize' });
      //await tokenInstance.deployed();
      console.log(`Deployed SeguraSafeSwapToken at ${tokenInstance.address}`);
  } catch (error) {
      console.error("Deployment failed:", error);
  }
}

main().catch((error) => {
  console.error("Script execution failed:", error);
  process.exitCode = 1;
});




/*const { ethers, upgrades } = require("hardhat");

async function main() {
  require('dotenv').config();
  const minterAddress = process.env.MINTER_ADDRESS;
  const pauserAddress = process.env.PAUSER_ADDRESS;
  const vetoerAddress = process.env.VETOER_ADDRESS;

  // Deploy the logic contract and proxy, and initialize the proxy
  const SeguraSafeSwapToken = await ethers.getContractFactory("SeguraSafeSwapToken");

  // Assuming your token has 18 decimals. Replace '1000000' with your desired initial supply
  const initialSupply = ethers.parseUnits('150000000', 18);

  const tokenInstance = await upgrades.deployProxy(SeguraSafeSwapToken, [initialSupply], { initializer: 'initialize' });
  //await tokenInstance.deployed();
  
  console.log(`Deployed SeguraSafeSwapToken at ${tokenInstance.address}`);

  // Grant roles through the proxy
  await tokenInstance.grantRole(ethers.utils.id('MINTER_ROLE'), minterAddress);
  await tokenInstance.grantRole(ethers.utils.id('PAUSER_ROLE'), pauserAddress);
  await tokenInstance.grantRole(ethers.utils.id('VETOER_ROLE'), vetoerAddress);

  console.log('Roles granted for SeguraSafeSwapToken');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


*/

