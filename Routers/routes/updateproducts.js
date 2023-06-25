const express = require("express");
const path = require("path");
const router = express.Router();
const cookieParser = require('cookie-parser');
const updateproduct = require("../../product");


  router.get('/:productName', async (req, res) => {
    try {
      const productName = req.params.productName;// Retrieve the product ID from the query parameter
      // Find the product by ID
      const product = await updateproduct.findOne({ "name of product": productName });
      if (product) {
        // Render the updateproducts page with pre-filled data
        res.render('updateproducts', { product });
      } else {
        res.send('Product not found');
      }
    } catch (error) {
      console.error('Error retrieving product:', error);
      res.status(500).send('Error retrieving product');
    }
  });
  
  router.post('/:productName', async (req, res) => {
    const productName = req.params.productName;
    const productData = req.body;
  
    // Check if any field is empty
    for (const key in productData) {
      if (!productData[key]) {
        return res.send('Please fill in all fields');
      }
    }
  
    try {
      // Find the product by name
      const existingProduct = await updateproduct.findOne({ "name of product": productName });
  
      if (existingProduct) {
        // Update the existing product with the new data
        existingProduct.set(productData);
        await existingProduct.save();
        res.redirect('/SupplierPage');
      } else {
        return res.send('Product not found');
      }
    } catch (error) {
      // Handle any errors that occur during saving or updating
      console.error('Error saving/updating product:', error);
      res.status(500).send('Error saving/updating product');
    }
  });
  
  

module.exports = router;
