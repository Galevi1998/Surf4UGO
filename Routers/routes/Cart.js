const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const Product = require("../../product");

// Add bodyParser and cookieParser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser());

router.get('/', async (req, res) => {
  const cartItems = req.cookies.ProductCart || [];
  console.log(cartItems);

  try {
    // Retrieve the product data from the database for each product in the cart
    const productNames = cartItems.map(item => item.name);
    const products = await Product.find({ 'name of product': { $in: productNames } });
    console.log(productNames);
    console.log(products);


    res.render('Cart', { cartItems, products });
  } catch (error) {
    console.error('Error retrieving product data:', error);
    res.send('Error retrieving product data');
  }
});

module.exports = router;


  