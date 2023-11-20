// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FarmingContract is ReentrancyGuard, Ownable {
    IERC20 public lpToken; // LP token for staking
    IERC20 public rewardToken; // Token used for rewards

    uint256 public rewardRate; // Rate of reward distribution
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;

    struct Stake {
        uint256 amount;
        uint256 rewardPerTokenPaid;
        uint256 rewards;
    }

    mapping(address => Stake) public stakes;
    uint256 private _totalSupply;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);

    constructor(address _lpToken, address _rewardToken, uint256 _rewardRate) {
        lpToken = IERC20(_lpToken);
        rewardToken = IERC20(_rewardToken);
        rewardRate = _rewardRate;
    }

    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    function stake(uint256 amount) external nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Cannot stake 0");
        _totalSupply += amount;
        stakes[msg.sender].amount += amount;
        lpToken.transferFrom(msg.sender, address(this), amount);
        emit Staked(msg.sender, amount);
    }

    function withdraw(uint256 amount) public nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Cannot withdraw 0");
        _totalSupply -= amount;
        stakes[msg.sender].amount -= amount;
        lpToken.transfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount);
    }

    function claimReward() public nonReentrant updateReward(msg.sender) {
        uint256 reward = stakes[msg.sender].rewards;
        if (reward > 0) {
            stakes[msg.sender].rewards = 0;
            rewardToken.transfer(msg.sender, reward);
            emit RewardPaid(msg.sender, reward);
        }
    }

    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;
        if (account != address(0)) {
            stakes[account].rewards = earned(account);
            stakes[account].rewardPerTokenPaid = rewardPerTokenStored;
        }
        _;
    }

    function earned(address account) public view returns (uint256) {
        return (stakes[account].amount * (rewardPerToken() - stakes[account].rewardPerTokenPaid)) / 1e18 + stakes[account].rewards;
    }

    function rewardPerToken() public view returns (uint256) {
        if (_totalSupply == 0) {
            return rewardPerTokenStored;
        }
        return rewardPerTokenStored + ((block.timestamp - lastUpdateTime) * rewardRate * 1e18) / _totalSupply;
    }

    // Admin functions for setting reward rate, adding rewards, etc.
    // Ensure to implement necessary security measures and access controls
}
