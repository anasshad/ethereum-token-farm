pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    address public owner;
    string public name = "Token Farm";
    DappToken public dappToken;
    DaiToken public daiToken;

    address[] public stakers;
    mapping(address => uint256) public stakeBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    event Stake(address _investor, uint256 _amount);

    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;

        owner = msg.sender;
    }

    //function to stake tokens
    function stakeTokens(uint256 _amount) public {
        //Amount should be greater than zero
        require(_amount > 0, "Amount staked should be greater than zero");

        //transfer dai tokens to tokenFarm
        daiToken.transferFrom(msg.sender, address(this), _amount);

        //save stake balance
        stakeBalance[msg.sender] = stakeBalance[msg.sender] + _amount;

        //add user to stakers array if not already staked
        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        //Update staking status
        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;

        //emit stake event
        emit Stake(msg.sender, _amount);
    }

    //issuing tokens
    function issueTokens() public {
        require(msg.sender == owner, "caller must be the owner");

        for (uint256 i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint256 balance = stakeBalance[recipient];
            if (balance > 0) {
                dappToken.transfer(recipient, balance);
            }
        }
    }

    //unstake tokens
    function unstakeTokens() public {
        //stakeBalance should be greater than zero
        require(stakeBalance[msg.sender] > 0, "Stake balance is zero");

        //transfer all dai tokens back to investor
        daiToken.transfer(msg.sender, stakeBalance[msg.sender]);

        //set stake balance of investor to zero
        stakeBalance[msg.sender] = 0;

        //set staking to false
        isStaking[msg.sender] = false;
    }
}
