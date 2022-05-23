import React, { useState } from "react";
import { InMemoryCache, ApolloClient, ApolloProvider, useQuery, gql } from "@apollo/client";
import {ethers} from "ethers";
import { cashABI } from "./cashABI";
import { assets, liabilities, expenses, revenues, other } from "./chartOfAccounts";
import { Framework } from "@superfluid-finance/sdk-core";

//note: we will begin by simply displaying the most recent tx for sale and expense
function CompanyDashboard({ userAddress, companyAddress, provider }) {

    const client = new ApolloClient({
        uri: "https://thegraph.com/hosted-service/subgraph/superfluid-finance/protocol-v1-kovan",
        cache: new InMemoryCache()
    })

    const sampleAddr = "0x9421fe8eccafad76c3a9ec8f9779fafa05a836b3";

    const CompanyContract = new ethers.Contract(companyAddress, cashABI, provider);

    async function getPayments() {
        const readPayments = await CompanyContract.queryFilter(CompanyContract.filters.discretePaymentMade());
        // console.log(readPayments[0])
        // console.log(readPayments[1]);
        const decoded0 = ethers.utils.defaultAbiCoder.decode(['uint'], readPayments[0].topics[3]);

        const decoded1 = ethers.utils.defaultAbiCoder.decode(['uint'], readPayments[1].topics[3]);
        const decodedValue0 = ethers.utils.formatUnits(ethers.utils.defaultAbiCoder.decode(['uint'], readPayments[0].topics[2]).toString(), 'ether');
        const decodedValue1 = ethers.utils.formatUnits(ethers.utils.defaultAbiCoder.decode(['uint'], readPayments[1].topics[2]).toString(), 'ether');
        console.log(Number(decodedValue0).toFixed(2));
        console.log(Number(decodedValue1).toFixed(2));
        

        const expense0 = Number(decoded0);
        const expense1 = Number(decoded1);
        console.log(expenses[expense0])
        console.log(expenses[expense1])
    }

    // getPayments();

    const TRANSFER_QUERY = gql`
    query GetTransfers ($contractAddress: String!) {
        transferEvents(where: {to: $contractAddress, from_not: "0x0000000000000000000000000000000000000000"}) {
          token
          timestamp
          value
          transactionHash
          from {
              id
          }
        }
      }
    `;
    
    const { loading, error, data } = useQuery(TRANSFER_QUERY, { variables: {
        contractAddress: companyAddress.toLowerCase() 
    } },);

    if (loading) {
        console.log("loading...");
    }
    if (error) {
        console.log(error)
    }
    if (data !== undefined) {
        console.log(data);
        if (data.length > 0) {
            getPayments()
        }
        // console.log(ethers.utils.));
        // console.log(new Date(data.transferEvents[0].timestamp * 1000))
    }

    const renderTransfersTable = () => {
        
        return (
            <tbody>
            {data.transferEvents.map(tx => (
                <tr key={tx.transactionHash}>
                <td>{`${(new Date(tx.timestamp * 1000)).getMonth()}/${(new Date(tx.timestamp * 1000)).getDate()}/${(new Date(tx.timestamp * 1000)).getFullYear()}`}</td>
                <td>{Number(ethers.utils.formatEther(tx.value)).toFixed(2)}</td>
                <td>{tx.from.id}</td>
                </tr>           
            ))
            }
            </tbody>

        )
    }

    return (
        <div>
        
       
        <div>
            <h2>Welcome Company 1</h2>
        </div>

        <div>
            <h2>Most recent sales</h2>
            <div>
            {
            loading? 
            <h2>Loading... </h2>
            :
            <div>
            <table>
                <thead>
                    <tr>
                    <th>Date</th>
                    <th>Value</th>
                    <th>From</th>
                    </tr>
                </thead>
                
                {
                renderTransfersTable()
                }
            </table>
            </div>
            }
        </div>
        <div>
            <h2>Most recent expenses</h2>
        </div>
        </div>

        </div>
    )
}

export default CompanyDashboard;