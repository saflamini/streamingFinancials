//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import { Cash } from "./Cash.sol";

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

import { ISuperfluid, ISuperToken } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";

import { IConstantFlowAgreementV1 } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";

contract CompanyFactory is Ownable {

    ISuperfluid host;

    constructor(ISuperfluid _host) {
        host = _host;
    }

    event companyCreated(address indexed creator, uint indexed id);

    mapping (address => uint) public ownerToCompanyId;
    mapping(uint => Cash) public idToCompany;

    //starts at 1, because if you query getCompanyIdByOwner with an address that does not exist in the mapping, then it will return 0
    //this will make it look like you're getting the company with id of 0, but it may not be the case
    //will make this id number public to allow our system determine what number we're at
    uint public idCounter = 1;

    function createCompany() external {
        Cash newCash = new Cash(host, msg.sender);

        ownerToCompanyId[msg.sender] = idCounter;
        idToCompany[idCounter] = newCash;
        //emit companyCreated event so we can listen for it and add this company to our list
        emit companyCreated(msg.sender, idCounter);
        idCounter++;
    }

    function getCompanyById(uint id) external view returns (Cash) {
        return idToCompany[id];
    }

    function getCompanyIdByOwner(address owner) external view returns (uint) {
        return ownerToCompanyId[owner];
    }
}