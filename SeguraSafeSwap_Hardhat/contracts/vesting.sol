// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract TokenVesting is Initializable, OwnableUpgradeable {
    IERC20Upgradeable private _token;

    struct VestingSchedule {
        uint256 totalAmount;
        uint256 amountReleased;
        uint256 vestingCliff;
        uint256 vestingDuration;
        bool isRevocable;
    }

    mapping(address => VestingSchedule) public vestingSchedules;
    mapping(address => bool) public revocations;

    event TokensReleased(address beneficiary, uint256 amount);
    event VestingRevoked(address beneficiary);

    function initialize(IERC20Upgradeable tokenAddress) public initializer {
        __Ownable_init(_msgSender());
        _token = tokenAddress;
    }

    // ... other functions ...

    function release(address beneficiary) public {
        VestingSchedule storage vesting = vestingSchedules[beneficiary];
        bool isRevoked = revocations[beneficiary];

        require(vesting.totalAmount > 0, "There is no vesting schedule for this beneficiary.");
        require(block.timestamp > vesting.vestingCliff, "The cliff period has not ended yet.");
        require(!isRevoked, "The vesting has been revoked.");

        uint256 unreleased = _releasableAmount(vesting, beneficiary);

        require(unreleased > 0, "No releasable amount available.");

        vesting.amountReleased += unreleased;

        _token.transfer(beneficiary, unreleased);

        emit TokensReleased(beneficiary, unreleased);
    }

    function _releasableAmount(VestingSchedule memory vesting, address beneficiary) private view returns (uint256) {
        return _vestedAmount(vesting, beneficiary) - vesting.amountReleased;
    }

    function _vestedAmount(VestingSchedule memory vesting, address beneficiary) private view returns (uint256) {
        uint256 currentBalance = _token.balanceOf(address(this));
        uint256 totalBalance = currentBalance + vesting.amountReleased;

        if (block.timestamp < vesting.vestingCliff) {
            return 0;
        } else if (block.timestamp >= vesting.vestingCliff + vesting.vestingDuration || revocations[beneficiary]) {
            return vesting.totalAmount;
        } else {
            uint256 vestingTime = block.timestamp - vesting.vestingCliff;
            uint256 vestedAmount = (vesting.totalAmount * vestingTime) / vesting.vestingDuration;
            return vestedAmount > totalBalance ? totalBalance : vestedAmount;
        }
    }
}
