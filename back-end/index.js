const express = require("express");
const cron = require("node-cron");
const { ApolloClient, InMemoryCache, gql, HttpLink } = require('@apollo/client');
const  http =  require('http');
const app = express();
const fetch = require("cross-fetch");
const pool = require("./db");
const port = 3002;
require("dotenv").config();
const { ethers } = require("ethers");

//Note - this is going to be hard coded for kovan to begin

const CompanyFactory = require("../artifacts/contracts/CompanyFactory.sol/CompanyFactory.json");
const CompanyFactoryABI = CompanyFactory.abi;
const CompanyFactoryAddress = "0x6b1a6985E4Ab56f9dA93DF88E067DA18b847F084";
const Company = require("../artifacts/contracts/Cash.sol/Cash.json");
const CompanyABI = Company.abi;

const { Framework } = require("@superfluid-finance/sdk-core");
const { time } = require("console");

const provider = new ethers.providers.JsonRpcProvider(process.env.KOVAN_URL);

const companyFactory = new ethers.Contract(CompanyFactoryAddress, CompanyFactoryABI, provider);


const KOVAN_SUBGRAPH_URL = "https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-kovan";

const transferQuery = `
    query GetTransfers {
        transferEvents(where: {to: "0x9421fe8eccafad76c3a9ec8f9779fafa05a836b3", from_not: "0x0000000000000000000000000000000000000000"}) {
        token
        timestamp
        value
        transactionHash
        from {
          id
        }
     }   
    }`;

const client = new ApolloClient({
    link: new HttpLink({uri: KOVAN_SUBGRAPH_URL, fetch}),
    cache: new InMemoryCache()
});

//this is a cron job which runs a query every xyz seconds
//TODO
//1) Set up DB schema for writing new events to DB
//2) Find a way to avoid duplicates - try to only query the last 50 blocks or something and catch every event with a unique tx hash + timestamp
//3) encode the above logic + a post request in our function
//4) host this instance of express on linode
//5) build a second server which serves as our intermediary between web app and DB


//We need several queries
//1) Companies created
//2) Accounts authorized... should query events for this
//3) Incoming transactions - 2 part: erc20 transfers, and flowUpdated events 
//4) Outgoing transactions - 2 part: streams created from the contract, and the pay function called

async function companyQuery() {
    //run query to get current idCounter
    const currentIdCounter = await companyFactory.idCounter();
    //get id of most recent company.. select the highest ID from the table
    console.log("current Id counter is: ", currentIdCounter.toString());
    const result = await pool.query("SELECT max(id) FROM companies");

    console.log(result.rows)
    //make sure that the row length is > 0.... if it is 0, it means that there are no entries
    if (result.rows[0].max !== null) {
        let highestId = result.rows[0].max;
        console.log("Maximum ID value is: ", highestId);

        const delta = Number(currentIdCounter) - highestId;
        console.log("delta between highest existing id and highest id in db: ", delta);
        
        if (delta > 1) {
            for (let i = 0; i < delta - 1; i++) {
                let companyId = highestId + 1;
                let companyAddress = await companyFactory.getCompanyById(companyId);
                let currentCompany = new ethers.Contract(companyAddress, CompanyABI, provider);
                let companyOwner = await currentCompany.owner();
                let chain_id = 42; //hardcoded to kovan
    
                console.log("id = ", companyId);
                console.log("company address = ", companyAddress);
                console.log("company owner = ", companyOwner);
                console.log("chain id = ", chain_id);
                highestId++;
                
                await pool.query("INSERT INTO companies (id, owner, address, chain_id)", [companyId, companyOwner, companyAddress, chain_id])
            }
        }
        
    } else {
        console.log("there are not any available entries on this network");
        //current id entry is zero. delta is 
        const delta = Number(currentIdCounter);
        console.log("delta between highest existing id and highest id in db: ", delta);
        let highestId = result.rows[0].max;

        for (let i = 0; i < delta - 1; i++) {
            let companyId = highestId + 1;
            let companyAddress = await companyFactory.getCompanyById(companyId);
            let currentCompany = new ethers.Contract(companyAddress, CompanyABI, provider);
            let companyOwner = await currentCompany.owner();
            let chain_id = 42; //hardcoded to kovan

            console.log("id = ", companyId);
            console.log("company address = ", companyAddress);
            console.log("company owner = ", companyOwner);
            console.log("chain id = ", chain_id);
            highestId++;

            await pool.query("INSERT INTO companies (id, owner, address, chain_id) VALUES ($1, $2, $3, $4)", [companyId, companyOwner, companyAddress, chain_id])
        }
    }

    


    //calculate delta between current id counter and highest Id in table
    //run loop which gets all companies from companyFactory with idCounter greater than highest amount in the table
    //this loop should iterate up to, but not including, the delta between current id and highest id in table - 1

    //check company list
    //SELECT * FROM companies WHERE id < currentIdCounter
    //add each company to list
    //is most recent ID in DB for that network < the most recent Id that is retreived from calling idCounter?
    //if not, then run query where company ID is > the most recent ID
    // add all of those companies to our DB
}

async function accountQuery() {
    //get all companies from DB
    const companies = await pool.query("SELECT * FROM companies");

    const currentBlockInfo = await provider.getBlock();
    const currentBlock = currentBlockInfo.number;
    //loop through list of companies from DB
    for (let i = 0; i < companies.rows.length; i++) {            
        //create new contract object for each company based on address
        let companyId = await companyFactory.getCompanyIdByOwner(companies.rows[i].owner)
        let companyContract = new ethers.Contract(companies.rows[i].address, CompanyABI, provider);
        //call queryFilter on that contract object to get the authorization event
        //need to only query the most recent blocks
        let authorizationData = await companyContract.queryFilter(companyContract.filters.accountAuthorized(), currentBlock - 50000, currentBlock); //get last 1-4 hours worth of blocks
        let revokedData = await companyContract.queryFilter(companyContract.filters.accountRevoked(), currentBlock - 50000, currentBlock); //get last 1-4 hours worth of blocks
        let newEvents = [];
        for (let j = 0; j < authorizationData.length; j++) {
            // newEvents.push(authorizationData[j].args);
            newEvents.push(authorizationData[j]);
        }
        for (let k = 0; k < revokedData.length; k++) {
            // newEvents.push(revokedData[k].args);
            newEvents.push(revokedData[k]);
        }
    
        newEvents.sort((a, b) => Number(a.args[1].toString()) - Number(b.args[1].toString()));
      
        //NOTE - need to get the event type
        for (let l = 0; l - newEvents.length; l++) {
            let currentAccount = await pool.query("SELECT * FROM accounts WHERE address = $1 AND company_address = $2", [newEvents[l].args[0], companies.rows[i].address]);
            //if the row does not exist at all - i.e. if there is no current account
            if (currentAccount.rows.length === 0) {
                //if the accountAuthorized event is emitted - and this should be the only event emitted if the currrent row is 0
                //insert an entire account record into the db
                if (newEvents[l].event === 'accountAuthorized') {
                    await pool.query("INSERT INTO accounts (address, company_address, company_id, last_changed, chain_id, authorized) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [newEvents[l].args[0], companies.rows[i].address, Number(companyId.toString()), (Number(newEvents[l].args[1].toString()) * 1000), 42, true]);
                }
                else {
                    console.log("no valid event emitted - this block ran in error");
                }
            }
            //if the current row for this given account is already existing (i.e. if we get back a row for the existing company)
            else if (currentAccount.rows.length === 1) {
                //if account revoked, set the value of authorized to false
                if (newEvents[l].event === 'accountRevoked') {
                    await pool.query("UPDATE accounts SET authorized = false WHERE address = $1 AND company_address = $2", [newEvents[l].args[0], companies.rows[i].address]);
                }
                //if account authorized, set value of authorized to true
                else if (newEvents[l].event === 'accountAuthorized') {
                    await pool.query("UPDATE accounts SET authorized = true WHERE address = $1 AND company_address = $2", [newEvents[l].args[0], companies.rows[i].address]);
                } 
                else {
                    console.log("no valid event emitted - this block ran in error");
                }
            }
            else {
                console.log("no valid event emitted - this block ran in error or you for some reason have too many rows for this given query");
            }
            
            //check if account exists in DB for this company by running a select query
            //if account does not exist, write to DB 
            //if account does not exist, update the authorized value accordingly
        }
        
        // console.log(newEvents[2])
        
        // let accountAddress;
        // let timestamp;
        // let convertedTimeStamp;
        // if (authorizationData.length > 0) {
        //     accountAddress = authorizationData[i].args.newAuthorizedAccount;
        //     console.log('account', accountAddress);
        //     timestamp = authorizationData[i].args.dateAuthorized.toString();
        //     convertedTimeStamp = new Date(Number(timestamp * 1000))
        //     console.log('timestamp: ', convertedTimeStamp)
        // }

        //call queryFilter on that contract object to also get the revoke events
       
        // if (revokedData.length > 0) {
        //     let accountAddress = revokedData[i].args.revokedAccount;
        //     console.log('account', accountAddress);
        //     let timestamp = revokedData[i].args.dateRevoked.toString();
        //     let convertedTimeStamp = new Date(Number(timestamp * 1000))
        //     console.log('timestamp: ', convertedTimeStamp)
        // }

    }

    
    //we should filter all events by timestamp... check the most recent (i.e within the last xyz seconds/minutes/hours)
    //loop through our list of events which are ordered by timestamp
    //make insert or update in database according to the event.
    //if the event is an authorization
        //check if record exists in DB
            //if it does not exist in the DB, create a new record via INSERT INTO
            //if it does exist in DB, make an UPDATE to the authorized column so that it is TRUE for the given account
    //if the event is a revoke
        //make an UPDATE to the authorized column so that it is FALSE for the given account
    
}

async function getIncomingTransfers() {

}

async function getIncomingStreams() {

}

async function getOutgoingStreams() {

}

async function getIncomingStreams() {

}

async function runQueries() {
//     const data = await client.query({
//         query: gql(transferQuery)
//     });
//     console.log(data.data);
//     const eventType = data.data.transferEvents[0].__typename;
//     const token = data.data.transferEvents[0].token;
//     const timestamp = data.data.transferEvents[0].timestamp;
//     const value = data.data.transferEvents[0].value;
//     const hash = data.data.transferEvents[0].transactionHash;
//     const from = await data.data.transferEvents[0].from.id;

//     console.log('reading data from first transfer event for address: 0x9421fe8eccafad76c3a9ec8f9779fafa05a836b3')
//     console.log("Event type: ", eventType);
//     console.log("hash: ", hash);
//     console.log("token: ", token);
//     console.log("timestamp: ", timestamp);
//     console.log("value: ", value);
//     console.log("from: ", from);

    // companyQuery();
    accountQuery();
}

app.listen(port, () => {
    // cron.schedule("*/30 * * * * *", () => {
    //     console.log(KOVAN_SUBGRAPH_URL)
    //     console.log("running once every 30 seconds");
    //     runQueries();
    // });
    runQueries();
})
