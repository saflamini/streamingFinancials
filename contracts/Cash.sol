//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import { ISuperfluid, ISuperToken } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";

import { IConstantFlowAgreementV1 } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";

import { CFAv1Library } from "@superfluid-finance/ethereum-contracts/contracts/apps/CFAv1Library.sol";

contract Cash {

    using CFAv1Library for CFAv1Library.InitData;

    CFAv1Library.InitData public cfaV1;

    mapping (address => bool) private authorizedAccounts; 
    ISuperfluid host;
    IConstantFlowAgreementV1 cfa;
    address public owner;

    constructor(ISuperfluid _host, address _owner) {
        host = _host;

        _host = host;
        cfa = IConstantFlowAgreementV1(
            address(
                host.getAgreementClass(
                    keccak256(
                        "org.superfluid-finance.agreements.ConstantFlowAgreement.v1"
                    )
                )
            )
        );

        cfaV1 = CFAv1Library.InitData(host, cfa);
        owner = _owner;

    }

    //require the caller to also be an authorized account or the owner
    //fwiw we will need more levels of access control, but this will do for our poc
    function authorizeAccountFromOwner(address _accountToAuthorize) external {
        require(msg.sender == owner, "unauthorized");
        authorizedAccounts[_accountToAuthorize] = true;
        emit accountAuthorized(_accountToAuthorize, block.timestamp);
    }

    function removeAccountAuthorizationFromOwner(address _accountToRevoke) external {
        require(msg.sender == owner, "unauthorized");
        authorizedAccounts[_accountToRevoke] = false;
        emit accountRevoked(_accountToRevoke, block.timestamp);
    }

    function authorizeAccount(address _accountToAuthorize) external {
        require(authorizedAccounts[msg.sender] == true, "not authorized");
        authorizedAccounts[_accountToAuthorize] = true;
        emit accountAuthorized(_accountToAuthorize, block.timestamp);
    }

    function removeAccountAuthorization(address _accountToRevoke) external {
        require(authorizedAccounts[msg.sender] == true, "not authorized");
        authorizedAccounts[_accountToRevoke] = false;
        emit accountRevoked(_accountToRevoke, block.timestamp);
    }

    //note: categories should be determined by number, not by string
    //strings are of variable length, which means that they're hashed with keccak256 
    //this prevents you from being able to decode the result

    event discretePaymentMade(address indexed receiver, uint indexed amount, uint16 indexed category, IERC20 token);
    event flowCreatedWithCategory(address indexed receiver, int96 indexed flowRate, uint16 indexed category, ISuperToken token);
    event flowUpdatedWithCategory(address indexed receiver, int96 indexed newFlowRate, uint16 indexed category, ISuperToken token);
    event flowDeletedWithCategory(address indexed receiver, uint16 indexed category, ISuperToken token);
    event erc20CashMoved(address indexed destination, uint indexed amount, IERC20 token);
    event superTokensMoved(address indexed destination, uint indexed amount, ISuperToken token);
    event accountAuthorized(address indexed newAuthorizedAccount, uint indexed dateAuthorized);
    event accountRevoked(address indexed revokedAccount, uint indexed dateRevoked);


    function pay(IERC20 _token, address _receiver, uint _amount, uint16 _category) external {
        require(_token.balanceOf(address(this)) >= _amount, "insufficient balance");
        require(authorizedAccounts[msg.sender] == true, "account is unauthorized");

        _token.transfer(_receiver, _amount);
        emit discretePaymentMade(_receiver, _amount, _category, _token);
    }

    function createFlow(address _receiver, int96 _flowRate, ISuperToken _token, uint16 _category) external {
        require(authorizedAccounts[msg.sender] == true, "account is unauthorized");

        cfaV1.createFlow(_receiver, _token, _flowRate);
        emit flowCreatedWithCategory(_receiver, _flowRate, _category, _token);
    }

    function updateFlow(address _receiver, int96 _flowRate, ISuperToken _token, uint16 _category) external {
        require(authorizedAccounts[msg.sender] == true, "account is unauthorized");

        cfaV1.updateFlow(_receiver, _token, _flowRate);
        emit flowUpdatedWithCategory(_receiver, _flowRate, _category, _token);
    }

    function deleteFlow(address _receiver, ISuperToken _token, uint16 _category) external {
        require(authorizedAccounts[msg.sender] == true, "account is unauthorized");

        cfaV1.deleteFlow(msg.sender, _receiver, _token);
        emit flowDeletedWithCategory(_receiver, _category, _token);
    }

    function withdrawSuperTokens(address _destination, uint _amount, ISuperToken _token) external {
        require(authorizedAccounts[msg.sender] == true || msg.sender == owner, "account is unauthorized");

        _token.transfer(_destination, _amount);
        emit superTokensMoved(_destination, _amount, _token);
    }

    function withdrawERC20Tokens(address _destination, uint _amount, IERC20 _token) external {
        require(authorizedAccounts[msg.sender] == true || msg.sender == owner, "account is unauthorized");

        _token.transfer(_destination, _amount);
        emit erc20CashMoved(_destination, _amount, _token);
    }

    function wrapSuperTokens(ISuperToken _token, uint amountToWrap) external {
        require(authorizedAccounts[msg.sender] == true, "account is unauthorized");

        _token.upgrade(amountToWrap);
    }

    function unWrapSuperTokens(ISuperToken _token, uint amountToUnWrap) external {
        require(authorizedAccounts[msg.sender] == true, "account is unauthorized");

        _token.downgrade(amountToUnWrap);
    }
    
}