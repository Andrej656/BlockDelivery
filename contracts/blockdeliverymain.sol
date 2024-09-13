// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Marketplace {
    struct Product {
        uint id;
        string name;
        string description;
        uint price;
        address payable seller;
        bool sold;
    }

    uint public productCount = 0;
    mapping(uint => Product) public products;

    event ProductCreated(
        uint id,
        string name,
        string description,
        uint price,
        address payable seller,
        bool sold
    );

    event ProductPurchased(
        uint id,
        string name,
        uint price,
        address payable seller,
        address payable buyer,
        bool sold
    );

    // Function to list a product for sale
    function createProduct(string memory _name, string memory _description, uint _price) public {
        require(_price > 0, "Price must be greater than zero");
        productCount++;
        products[productCount] = Product(productCount, _name, _description, _price, payable(msg.sender), false);
        emit ProductCreated(productCount, _name, _description, _price, payable(msg.sender), false);
    }

    // Function to purchase a product
    function purchaseProduct(uint _id) public payable {
        Product memory _product = products[_id];
        require(_product.id > 0 && _product.id <= productCount, "Product doesn't exist");
        require(msg.value == _product.price, "Incorrect price");
        require(!_product.sold, "Product already sold");
        require(_product.seller != msg.sender, "Seller cannot buy own product");

        // Transfer the funds to the seller
        _product.seller.transfer(msg.value);

        // Mark as sold
        _product.sold = true;
        products[_id] = _product;

        emit ProductPurchased(_id, _product.name, _product.price, _product.seller, payable(msg.sender), true);
    }
}
