// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

interface IDexRouter {
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);
}

contract BuybackManager {
    IDexRouter public immutable dexRouter;
    IERC20 public immutable stablecoin;
    IERC20 public immutable nativeToken;
    address public treasury;
    address public owner;

    constructor(address _dexRouter, address _stablecoin, address _nativeToken, address _treasury) {
        dexRouter = IDexRouter(_dexRouter);
        stablecoin = IERC20(_stablecoin);
        nativeToken = IERC20(_nativeToken);
        treasury = _treasury;
        owner = msg.sender;
    }

    function buybackAndBurn(uint256 amount) external {
        require(msg.sender == owner, "Not authorized");
        stablecoin.transferFrom(treasury, address(this), amount);

        address[] memory path = new address[](2);
        path[0] = address(stablecoin);
        path[1] = address(nativeToken);

        stablecoin.approve(address(dexRouter), amount);
        dexRouter.swapExactTokensForTokens(
            amount,
            0, // Replace with a minimum amount out if necessary
            path,
            address(this),
            block.timestamp
        );

        uint256 nativeTokenAmount = nativeToken.balanceOf(address(this));
        nativeToken.transfer(treasury, nativeTokenAmount); // Or burn them if that's the intended logic
    }

    // Add any necessary governance functions here...
}