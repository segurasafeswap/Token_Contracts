// scripts/deploy_liquiditypool.js

const hre = require("hardhat");

async function main() {
    const tokenAAddress = "0x..."; // Replace with the actual tokenA address
    const tokenBAddress = "0x..."; // Replace with the actual tokenB address
    const lpTokenAddress = "0x..."; // Replace with the actual LPToken address

    const LiquidityPool = await hre.ethers.getContractFactory("LiquidityPool");
    const liquidityPool = await LiquidityPool.deploy(tokenAAddress, tokenBAddress, lpTokenAddress);

    await liquidityPool.deployed();

    console.log("LiquidityPool deployed to:", liquidityPool.address);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});