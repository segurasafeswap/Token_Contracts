// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SeguraSafeSwapExchange {
    IERC20 public tokenA;
    IERC20 public tokenB;
    uint256 public reserveA;
    uint256 public reserveB;

    // This event is emitted when a swap occurs
    event Swap(address indexed user, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut);

    constructor(address _tokenA, address _tokenB) {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }

    // Call this function to add liquidity
    function addLiquidity(uint256 amountA, uint256 amountB) external {
        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transferFrom(msg.sender, address(this), amountB);
        reserveA += amountA;
        reserveB += amountB;
    }

    // Internal function to calculate the amount of tokens to send based on the amount received
    // and the current reserve. This uses the constant product formula.
    function getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut) public pure returns (uint256) {
        require(amountIn > 0, "Insufficient input amount");
        require(reserveIn > 0 && reserveOut > 0, "Insufficient liquidity");
        uint256 amountInWithFee = amountIn * 997; // 0.3% fee
        uint256 numerator = amountInWithFee * reserveOut;
        uint256 denominator = (reserveIn * 1000) + amountInWithFee;
        return numerator / denominator;
    }

    // Swap an amount of tokenA for tokenB
    function swapAForB(uint256 amountA) external {
        uint256 amountB = getAmountOut(amountA, reserveA, reserveB);
        require(amountB > 0, "Insufficient output amount");

        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transfer(msg.sender, amountB);

        reserveA += amountA;
        reserveB -= amountB;

        emit Swap(msg.sender, address(tokenA), address(tokenB), amountA, amountB);
    }

    // Swap an amount of tokenB for tokenA
    function swapBForA(uint256 amountB) external {
        uint256 amountA = getAmountOut(amountB, reserveB, reserveA);
        require(amountA > 0, "Insufficient output amount");

        tokenB.transferFrom(msg.sender, address(this), amountB);
        tokenA.transfer(msg.sender, amountA);

        reserveB += amountB;
        reserveA -= amountA;

        emit Swap(msg.sender, address(tokenB), address(tokenA), amountB, amountA);
    }

    // ... Add more functions as needed
}