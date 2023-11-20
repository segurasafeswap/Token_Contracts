const { ethers, upgrades } = require("hardhat");
const provider = new ethers.providers.JsonRpcProvider(url);

async function main() {
    const SeguraSafeSwapNFT1155 = await ethers.getContractFactory("SeguraSafeSwapNFT1155");
    const instancenft1155 = await upgrades.deployProxy(SeguraSafeSwapNFT1155, ["https://ipfs.io/ipfs/QmYFwY32zXpiuiXJtK1rJx1gYnAFSpfpx2MAjcsaDWRvCZ?filename=segurasafeswapnft1155.json", "SSSnft"], { initializer: 'initialize' });
    await instancenft1155.deployed();
    console.log('Deployed', instancenft1155.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});