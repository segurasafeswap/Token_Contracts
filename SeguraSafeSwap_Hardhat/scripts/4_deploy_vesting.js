const { ethers } = require("hardhat");
const provider = new ethers.providers.JsonRpcProvider(url);

async function main() {
    const TokenVesting = await ethers.getContractFactory("TokenVesting");
    const vestingContractInstance = await TokenVesting.deploy(/* constructor arguments */);
    await vestingContractInstance.deployed();

    console.log('TokenVesting deployed to:', vestingContractInstance.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});