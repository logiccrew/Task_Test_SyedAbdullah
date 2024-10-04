// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract BlumeLiquidStaking is ERC20 {
    using SafeERC20 for IERC20;
    IERC20 public investTokens;
    address public Owner;
    uint256 public totalStaked;
    IERC20 private stakeToken;

    mapping(address => uint256) public stakes;
    mapping(address => bool) public stakerAddress;
    event Stake(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);

    constructor(IERC20 _investToken, address owner)
        ERC20("Staked BLS", "stBLS")
    {
        require(
            address(_investToken) != address(0),
            "Please enter valid Invest Token"
        );

        require(address(owner) != address(0));

        Owner = owner;
        investTokens = _investToken;
        stakeToken = IERC20(address(this));
    }

    function stake(uint256 stakeAmount) public {
        require(stakeAmount > 0, "Please enter the Valid Stake Amount.");
        require(
            investTokens.balanceOf(msg.sender) >= stakeAmount,
            "You have insufficient balance to stake."
        );
        require(msg.sender != address(0), "User Wallet address cannot be zero");

        investTokens.safeTransferFrom(msg.sender,Owner, stakeAmount);
        mint(msg.sender, stakeAmount);
        stakerAddress[msg.sender] = true;
        totalStaked += stakeAmount;
        emit Stake(msg.sender, stakeAmount);
    }

    function mint(address to, uint256 amount) internal {
        _mint(to, amount);
    }

  


}
