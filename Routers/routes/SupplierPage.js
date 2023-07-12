const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const Product = require("../../product");


// Add bodyParser middleware
router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', async (req, res) => {
    try {
        const username = req.cookies.username; // Retrieve the brand value from the username cookie
        // Retrieve products from the database with the matching brand
        const products = await Product.find({ brand: username });
        // Render the EJS file 'supplierPage.ejs' and pass the products data
        res.render('supplierPage', { products });
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
  });

  router.post('/', async (req, res) => {
    try {
        const username = req.cookies.username; // Retrieve the brand value from the username cookie
      const sortBy = req.body.sorting; // Get the selected sorting option
      let products;
      if (sortBy === 'product-name') {
        products = await Product.find({ brand: username, quantity: { $gt: 0 } }).sort({ name: 1 });
      } else if (sortBy === 'product-price') {
        products = await Product.find({ brand: username, quantity: { $gt: 0 } }).sort({ price: 1 });
      } else if (sortBy === 'product-brand') {
        products = await Product.find({ brand: username, quantity: { $gt: 0 } }).sort({ brand: 1 });
      } else {
        // Handle invalid sorting option
        return res.status(400).send('Invalid sorting option');
      }
  
      res.render('supplierPage', { products });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  router.post('/Delete' , async(req,res)=>{
    console.log("GotIn");
    
  });

  module.exports = router;