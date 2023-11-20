require('dotenv').config();
const { ethers } = require("hardhat");
const provider = new ethers.providers.JsonRpcProvider(url);

async function main() {
    const TokenVesting = await ethers.getContractFactory("TokenVesting");
    const MyToken = await ethers.getContractFactory("MyToken");

    const vestingContractInstance = await TokenVesting.deployed();
    const myTokenInstance = await MyToken.deployed();

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
        privateSaleAmount,
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