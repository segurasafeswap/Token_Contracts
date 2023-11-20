require('dotenv').config();
const { ethers, upgrades } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    //const url = process.env.RPC_URL;
    //const provider = new ethers.providers.JsonRpcProvider(url);

    // Deploy Liquidity Pool Contract
    const LiquidityPool = await ethers.getContractFactory("LiquidityPool");
    const liquidityPoolInstance = await LiquidityPool.deploy(/* constructor arguments */);
    await liquidityPoolInstance.deployed();
    console.log('Deployed LiquidityPool at', liquidityPoolInstance.address);

    // Deploy SeguraSafeSwapExchange Contract
    const SeguraSafeSwapExchange = await ethers.getContractFactory("SeguraSafeSwapExchange");
    const seguraSafeSwapExchangeInstance = await SeguraSafeSwapExchange.deploy(/* constructor arguments */);
    await seguraSafeSwapExchangeInstance.deployed();
    console.log('Deployed SeguraSafeSwapExchange at', seguraSafeSwapExchangeInstance.address);

    // Deploy MultisigWallet
    const multisigwalletsigners = process.env.MULTISIG_WALLET_ADDRESSES.split(',');
    const requiredsignaturesformultisigwallet = process.env.REQUIRED_SIGNATURES;
    const multisigwallet = await ethers.getContractFactory("multisigwallet");
    const multisigwalletInstance = await multisigwallet.deploy(multisigwalletsigners, requiredsignaturesformultisigwallet);
    await multisigwalletInstance.deployed();
    console.log("MultisigWallet deployed to:", multisigwalletInstance.address);

    // Deploy MySecureContract (multisignerwallet.sol)
    // Assuming MULTISIG_WALLET_ADDRESS is the address of the already deployed MultisigWallet
    const multisignerswalletsigners = process.env.MULTISIG_WALLET_ADDRESS;
    const multisignerwallet = await ethers.getContractFactory("multisignerwallet");
    const multisignerContractInstance = await multisignerwallet.deploy(multisignerswalletsigners);
    await multisignerContractInstance.deployed();
    console.log("multisignerContract deployed to:", multisignerContractInstance.address);
    
    // Common Addresses from .env
    const minterAddress = process.env.MINTER_ADDRESS;
    const pauserAddress = process.env.PAUSER_ADDRESS;
    const vetoerAddress = process.env.VETOER_ADDRESS;

    // Deploy SeguraSafeSwapToken
    const SeguraSafeSwapToken = await ethers.getContractFactory("SeguraSafeSwapToken");
    const tokenInstance = await upgrades.deployProxy(SeguraSafeSwapToken, [/* constructor arguments for the initialize function */], { initializer: 'initialize' });
    await tokenInstance.deployed();
    console.log(`Deployed SeguraSafeSwapToken at ${tokenInstance.address}`);
    
    // Grant roles for SeguraSafeSwapToken
    await tokenInstance.grantRole(ethers.utils.id('MINTER_ROLE'), minterAddress);
    await tokenInstance.grantRole(ethers.utils.id('PAUSER_ROLE'), pauserAddress);
    await tokenInstance.grantRole(ethers.utils.id('VETOER_ROLE'), vetoerAddress);
    console.log('Roles granted for SeguraSafeSwapToken');

    // Deploy SeguraSafeSwapNFT1155
    //const SeguraSafeSwapNFT1155 = await ethers.getContractFactory("SeguraSafeSwapNFT1155");
    //const nft1155Instance = await upgrades.deployProxy(SeguraSafeSwapNFT1155, ["https://your-metadata-uri/", "SSSnft"], { initializer: 'initialize' });
    //await nft1155Instance.deployed();
    //console.log('Deployed SeguraSafeSwapNFT1155 at', nft1155Instance.address);

    // Deploy SeguraSafeSwapNFT721
    //const SeguraSafeSwapNFT721 = await ethers.getContractFactory("SeguraSafeSwapNFT721");
    //const nft721Instance = await upgrades.deployProxy(SeguraSafeSwapNFT721, ["https://your-metadata-uri/", "SSSnft"], { initializer: 'initialize' });
    //await nft721Instance.deployed();
    //console.log('Deployed SeguraSafeSwapNFT721 at', nft721Instance.address);

    // Address for the treasury
    const treasuryAddress = process.env.TREASURY_ADDRESS;
    console.log("Treasury Address:", treasuryAddress);

    // Deploy the Treasury contract
    const Treasury = await ethers.getContractFactory("Treasury");
    const treasury = await Treasury.deploy(treasuryAddress);

    await treasury.deployed();
    console.log("Treasury deployed to:", treasuryAddress);

    // Deploy Vesting Contract and Set up Token Vesting
    const TokenVesting = await ethers.getContractFactory("TokenVesting");
    const SeguraSafeSwap = await ethers.getContractFactory("SeguraSafeSwapToken");

    const vestingContractInstance = await TokenVesting.deployed();
    await vestingContractInstance.deployed();
    console.log('TokenVesting deployed to:', vestingContractInstance.address);
    const SeguraSafeSwapInstance = await SeguraSafeSwap.deployed();

    // Retrieve addresses from .env
    const foundersAddress = process.env.FOUNDERS_BENEFICIARY_ADDRESS;
    const developmentFundAddress = process.env.DEVELOPMENT_FUND_ADDRESS;
    const advisorsAddress = process.env.ADVISORS_ADDRESS;
    const privateSaleAddress = process.env.PRIVATE_SALE_ADDRESS;
    const publicSaleAddress = process.env.PUBLIC_SALE_ADDRESS;
    const partnershipsAddress = process.env.PARTNERSHIP_ADDRESS;
    const communityAddress = process.env.ECOSYSTEM_ADDRESS;
    const reservesAddress = process.env.RESERVES_ADDRESS;
    const liquiditypoolsAddress = process.env.LIQUIDITY_POOL_ADDRESS;
    // ... more addresses as needed

    // Define vesting amounts and schedules here
    const foundersAmount = web3.utils.toWei('3000000', 'ether'); // Adjust as per total supply percentage
    const developmentFundAmount = web3.utils.toWei('3600000', 'ether');
    const advisorsAmount = web3.utils.toWei('600000', 'ether'); // Adjust as per total supply percentage
    const privateSaleAmount = web3.utils.toWei('1500000', 'ether');
    const publicSaleAmount = web3.utils.toWei('11400000', 'ether');
    const partnershipsAmount = web3.utils.toWei('3000000', 'ether'); // Adjust as per total supply percentage
    const communityFundAmount = web3.utils.toWei('1500000', 'ether');
    const reservesAmount = web3.utils.toWei('1500000', 'ether'); // Adjust as per total supply percentage
    const liquiditypoolsFundAmount = web3.utils.toWei('3900000', 'ether');
    
    // ... other amounts
    
    const oneYearInSeconds = 60 * 60 * 24 * 365;
    const fourYearsInSeconds = oneYearInSeconds * 4;
 
    // Set up vesting for Founders and Team
    await vestingContractInstance.setVestingSchedule(
        foundersAddress,
        foundersAmount,
        oneYearInSeconds, // 1 year cliff
        fourYearsInSeconds, // 4 years duration
        true // revocable
    );
    
    // Set up vesting for Advisors
    await vestingContractInstance.setVestingSchedule(
        advisorsAddress,
        advisorsAmount,
        oneYearInSeconds, // 1 year cliff
        fourYearsInSeconds, // 4 years duration
        true // revocable
    );

    // Set up vesting for Founders and Team
    await vestingContractInstance.setVestingSchedule(
        developmentFundAddress,
        developmentFundAmount,
        oneYearInSeconds, // 1 year cliff
        fourYearsInSeconds, // 4 years duration
        true // revocable
    ); 

    // Set up vesting for Advisors
    await vestingContractInstance.setVestingSchedule(
        privateSaleAddress,
        privateSaleAmount,
        oneYearInSeconds, // 1 year cliff
        fourYearsInSeconds, // 4 years duration
        true // revocable
    );

    // Set up vesting for Founders and Team
    await vestingContractInstance.setVestingSchedule(
        publicSaleAddress,
        publicSaleAmount,
        oneYearInSeconds, // 1 year cliff
        fourYearsInSeconds, // 4 years duration
        true // revocable
    );
        
    // Set up vesting for Advisors
    await vestingContractInstance.setVestingSchedule(
        partnershipsAddress,
        partnershipsAmount,
        oneYearInSeconds, // 1 year cliff
        fourYearsInSeconds, // 4 years duration
        true // revocable
    );
      
    // Set up vesting for Founders and Team
    await vestingContractInstance.setVestingSchedule(
        communityAddress,
        communityFundAmount,
        oneYearInSeconds, // 1 year cliff
        fourYearsInSeconds, // 4 years duration
        true // revocable
    );
      
    // Set up vesting for Advisors
    await vestingContractInstance.setVestingSchedule(
        reservesAddress,
        reservesAmount,
        oneYearInSeconds, // 1 year cliff
        fourYearsInSeconds, // 4 years duration
        true // revocable
    );

    // Set up vesting for Advisors
    await vestingContractInstance.setVestingSchedule(
        liquiditypoolsAddress,
        liquiditypoolsFundAmount,
        oneYearInSeconds, // 1 year cliff
        fourYearsInSeconds, // 4 years duration
        true // revocable
    );

    console.log('Token vesting setup complete');
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

