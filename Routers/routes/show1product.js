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
  

  router.post('/Addto', (req, res) => {
    const action = req.body.action;
  
    if (action) {
      const [actionType, productName] = action.split(':');
  
      if (actionType === 'cart') {
        // Retrieve the existing cart items from the cookie
        const existingCart = req.cookies.ProductCart || [];
  
        // Check if the product already exists in the cart
        const existingProductIndex = existingCart.findIndex(item => item.name === productName);
  
        if (existingProductIndex !== -1) {
          // If the product already exists, update its quantity
          existingCart[existingProductIndex].quantity += 1;
        } else {
          // If the product doesn't exist, add it with quantity 1
          existingCart.push({ name: productName, quantity: 1 });
        }
  
        // Set the updated cart items to the "ProductCart" cookie
        res.cookie('ProductCart', existingCart, { maxAge: 86400000 }); // Cookie expires in 24 hours
  
        // Log the value of the "ProductCart" cookie
        console.log('ProductCart:', existingCart);
  
        res.redirect('/Cart');
      } else if (actionType === 'wishlist') {
        // Add the product name to the "ProductWishList" cookie
        const existingWishlist = req.cookies.ProductWishList || [];
  
        // Check if the product already exists in the wishlist
        const existingProductIndex = existingWishlist.findIndex(item => item.name === productName);
  
        if (existingProductIndex !== -1) {
          // If the product already exists, update its quantity
          existingWishlist[existingProductIndex].quantity += 1;
        } else {
          // If the product doesn't exist, add it with quantity 1
          existingWishlist.push({ name: productName, quantity: 1 });
        }
  
        // Set the updated wishlist items to the "ProductWishList" cookie
        res.cookie('ProductWishList', existingWishlist, { maxAge: 86400000 }); // Cookie expires in 24 hours
  
        // Log the value of the "ProductWishList" cookie
        console.log('ProductWishList:', existingWishlist);
  
        res.redirect('/WishList');
      } else {
        res.send('Invalid request');
      }
    } else {
      res.send('Invalid request');
    }
  });
  module.exports = router;
