import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import "./App.css"; // Add this line for CSS styling

const marketplaceAddress = "Your_Contract_Address";  // Replace with your deployed contract address
const marketplaceABI = [ /* Paste ABI here after deployment */ ];

function App() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  // State for form inputs
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

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

  // Create product function
  const createProduct = async (e) => {
    e.preventDefault();
    if (!name || !description || !price) {
      alert("Please fill in all fields");
      return;
    }

    const priceInWei = ethers.utils.parseEther(price.toString());
    const transaction = await contract.createProduct(name, description, priceInWei);
    await transaction.wait();
    alert("Product listed successfully!");

    // Clear the form
    setName("");
    setDescription("");
    setPrice("");
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <div className="App">
      <h1>BlockDelivery Marketplace</h1>
      {account ? <p>Connected as {account}</p> : <button onClick={loadBlockchainData}>Connect Wallet</button>}

      <form onSubmit={createProduct}>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Product Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Product Price (ETH)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button type="submit">List Product</button>
      </form>
    </div>
  );
}

export default App;
