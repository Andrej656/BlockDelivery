import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";

const marketplaceAddress = "Your_Contract_Address";  // Add your deployed contract address

const marketplaceABI = [ /* Paste ABI here after deployment */ ];

function App() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  // Connect wallet
  const loadBlockchainData = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    setProvider(provider);

    const signer = provider.getSigner();
    const address = await signer.getAddress();
    setAccount(address);

    const contract = new ethers.Contract(marketplaceAddress, marketplaceABI, signer);
    setContract(contract);
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <div>
      <h1>BlockDelivery Marketplace</h1>
      {account ? <p>Connected as {account}</p> : <button onClick={loadBlockchainData}>Connect Wallet</button>}
    </div>
  );
}

export default App;
