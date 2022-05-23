import React, { useState, useEffect } from "react";
import CompanyDashboard from "./CompanyDashboard";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { providerOptions } from "./providerOptions";
import { factoryABI, factoryAddress } from "./factoryABI";
import { InMemoryCache, ApolloClient, ApolloProvider, useQuery, gql } from "@apollo/client";
import { Framework } from "@superfluid-finance/sdk-core";

const client = new ApolloClient({
    uri: "https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-kovan",
    cache: new InMemoryCache()
})

const web3Modal = new Web3Modal({
    cacheProvider: true,
    providerOptions // required
  });

function Web3Setup() {

    const [walletConnected, setWalletConnected] = useState(false);
    const [web3ModalInstance, setWeb3ModalInstance] = useState("");
    const [companyConnected, setCompanyConnected] = useState(false);
    const [connectedWallet, setConnectedWallet] = useState("");
    const [connectedCompany, setConnectedCompany] = useState("");
    const [web3Provider, setWeb3Provider] = useState("");
    const [activeSigner, setActiveSigner] = useState("");
    const [chainId, setChainId] = useState("");

    const refreshState = () => {
        setWalletConnected(false);
        setCompanyConnected(false);
        setConnectedWallet("");
        setConnectedCompany("");
        setWeb3Provider("");
        setActiveSigner("");
        setChainId("");
    }

    const disconnect = async () => {
        await web3Modal.clearCachedProvider();
        refreshState();
    }

    useEffect(() => {
        if (web3Modal.cachedProvider) {
          connectWallet();
        }
      }, []);

    useEffect(() => {
        
        if (web3ModalInstance?.on) {
            const handleAccountsChanged = (accounts) => {
                console.log(accounts[0]);

                // disconnect();
                connectWallet()
                setConnectedWallet(accounts[0]);
                console.log(connectedWallet)
                getConnectedCompany();
                
            }

            const handleChainChanged = (hexChainId) => {
                setChainId(hexChainId);
                disconnect();
                connectWallet();
                getConnectedCompany();
            }

            const handleDisconnect = () => {
                disconnect();
            }

            web3ModalInstance.on("accountsChanged", handleAccountsChanged);
            web3ModalInstance.on("chainChanged", handleChainChanged);
            web3ModalInstance.on("disconnect", handleDisconnect);

            return () => {
                if (web3ModalInstance.removeListener) {
                  web3ModalInstance.removeListener("accountsChanged", handleAccountsChanged);
                  web3ModalInstance.removeListener("chainChanged", handleChainChanged);
                  web3ModalInstance.removeListener("disconnect", handleDisconnect);
                }
              };
        }
    }, [web3ModalInstance]);

    useEffect(() => {
        if (activeSigner !== undefined && activeSigner !== "") {
            console.log(connectedWallet)
            getConnectedCompany();
        }
    }, [activeSigner])
    

    async function connectWallet() {
        try {
            const instance = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(instance);
            const signer = provider.getSigner();
            const accountList = await provider.listAccounts();
            const network = await provider.getNetwork();
            setChainId(network.chainId);
            setConnectedWallet(accountList[0]);
            setWeb3ModalInstance(instance);
            setWeb3Provider(provider);
            setActiveSigner(signer);
            setWalletConnected(true);
        } catch (err) {
            console.log(err)
        }
    }

    //note - this currently throws an error ever time we change chains
    //need to whitelist the addresses on each network for the factory and conditionally create the factory contract object based on the chain
    async function getConnectedCompany() {
        try {
            console.log(connectedWallet)
            let factory = new ethers.Contract(factoryAddress, factoryABI, activeSigner);
            const id = await factory.connect(activeSigner).getCompanyIdByOwner(connectedWallet);
            const co = await factory.connect(activeSigner).getCompanyById(Number(id));
            if (co !== "0x0000000000000000000000000000000000000000") {
                setConnectedCompany(co);
                setCompanyConnected(true);
            }
            else if(co === "0x0000000000000000000000000000000000000000") {
                setConnectedCompany("");
            }
    
        } catch (err) {
            console.error(err);
        }
    }

    async function createCompany() {
        let factory = new ethers.Contract(factoryAddress, factoryABI, web3Provider);
        await factory.connect(activeSigner).createCompany().then(console.log);
    }

    function renderCompanyInfo() {
        if (companyConnected === false || connectedCompany === "") {
            return (
                <div>
                    <h2>Create Your Company</h2> 
                    <button onClick={createCompany}>Create</button>
                </div>
            );
        } else {
            return (
                <div>
                    <ApolloProvider client={client}>
                    <CompanyDashboard userAddress={connectedWallet} companyAddress={connectedCompany} provider={web3Provider}/>
                    <h4>{connectedCompany}</h4>
                    </ApolloProvider>
                </div>
            );
        }
    }

    return (
        <div>
            <div>
                {
                    walletConnected === false? 
                    <button onClick={() => connectWallet()}>ConnectWallet</button>
                    : 
                    <div>
                        <h3>{connectedWallet}</h3>
                        <button onClick={disconnect}>Disconnect</button>
                    </div>
                }
            </div>
            {renderCompanyInfo()}
        </div>
    )
}

export default Web3Setup;
