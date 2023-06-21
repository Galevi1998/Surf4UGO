const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const Product = require("../../product");

// Add bodyParser middleware
router.use(bodyParser.urlencoded({ extended: false }));

router.get('/:productName', async (req, res) => {
    try {
      const productName = req.params.productName; // Access the value of the productName parameter
  
      // Query the database to find the product with the matching name
      const product = await Product.findOne({ "name of product": productName });
  
      if (product) {
        // If the product is found, render the view with the product data
        res.render('show1product', { products: [product] });
      } else {
        // If the product is not found, handle the error or display a message
        res.status(404).send('Product not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  module.exports = router;
