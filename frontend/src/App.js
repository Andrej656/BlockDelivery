import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import "./App.css"; // Ensure this file is added for styling

// Replace with your contract's deployed address and ABI
const marketplaceAddress = "Your_Contract_Address"; // Replace with your deployed contract address
const marketplaceABI = [ /* Your contract ABI here */ ];

function App() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [products, setProducts] = useState([]);

  // Form input states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  // Connect wallet and load blockchain data
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

    // Fetch existing products from the contract
    const productCount = await contract.productCount();
    let loadedProducts = [];
    for (let i = 1; i <= productCount; i++) {
      const product = await contract.products(i);
      loadedProducts.push(product);
    }
    setProducts(loadedProducts);
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

    // Clear the form and reload the product list
    setName("");
    setDescription("");
    setPrice("");
    loadBlockchainData(); // Reload product data after listing
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <div className="App">
      <header>
        <h1>BlockDelivery Marketplace</h1>
        {account ? <p>Connected as {account}</p> : <button onClick={loadBlockchainData}>Connect Wallet</button>}
      </header>

      <form onSubmit={createProduct}>
        <h2>List a New Product</h2>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Product Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Product Price (ETH)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          min="0"
          step="0.0001"
        />
        <button type="submit">List Product</button>
      </form>

      <h2>Available Products</h2>
      <div className="product-list">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div key={index} className="product-item">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p className="price">{ethers.utils.formatEther(product.price)} ETH</p>
              <p className="status">{product.sold ? "Sold" : "Available"}</p>
            </div>
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
}

export default App;
