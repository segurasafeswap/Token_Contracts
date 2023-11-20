// scripts/deploy_lptoken.js

const hre = require("hardhat");

async function main() {
    const LPToken = await hre.ethers.getContractFactory("LPToken");
    const lpToken = await LPToken.deploy("LPTokenName", "LP");

    await lpToken.deployed();

    console.log("LPToken deployed to:", lpToken.address);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});