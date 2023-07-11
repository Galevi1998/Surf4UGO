const express = require("express");
const path = require("path");
const router = express.Router();
const cookieParser = require('cookie-parser');
const Product = require("../../product");



router.get('/', async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    const permission = 1; // Set permission to 1

    const naming = req.cookies.naming || "Guest";
    res.render('Addproduct', { categories, permission, naming });
  } catch (error) {
    console.error('Error retrieving categories:', error);
    res.status(500).send('Internal Server Error');
  }
});



router.post('/', async (req, res) => {
  try {
    // Retrieve the product data from the request body
    const productData = req.body;

    // Check if any field is empty
    for (const key in productData) {
      if (!productData[key]) {
        return res.send('Please fill in all fields');
      }
    }

    // Check if a product with the same name already exists
    const existingProduct = await Product.findOne({ "name of product": productData["name of product"] });
    if (existingProduct) {
      return res.send('Product already exists');
    }

    // Create a new Product instance from the data
    const newProduct = new Product(productData);
    newProduct.brand = req.cookies.username;
    console.log(newProduct);

    // Save the product to the database
    await newProduct.save();

    // Send a response indicating success
    res.send('Product saved successfully');
  } catch (error) {
    // Handle any errors that occur during saving
    console.error('Error saving product:', error);
    res.status(500).send('Error saving product');
  }
});

module.exports = router;
