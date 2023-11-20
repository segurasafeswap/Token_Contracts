const { ethers, upgrades } = require("hardhat");
const provider = new ethers.providers.JsonRpcProvider(url);

async function main() {
    const SeguraSafeSwapNFT721 = await ethers.getContractFactory("SeguraSafeSwapNFT721");
    const instancenft721 = await upgrades.deployProxy(SeguraSafeSwapNFT721, ["https://ipfs.io/ipfs/QmTVwgmiHLUQsrZZoZa3eBm7KY67qU5t7Gsy7RPNZTTxUG?filename=segurasafeswap.json", "SSSnft"], { initializer: 'initialize' });
    await instancenft721.deployed();
    console.log('Deployed', instancenft721.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});