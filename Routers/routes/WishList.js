const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const Product = require("../../product");

// Add bodyParser and cookieParser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser());

router.get('/', async (req, res) => {
  const cartItems = req.cookies.ProductWishList || [];
  console.log(cartItems);

  try {
    // Retrieve the product data from the database for each product in the cart
    const productNames = cartItems.map(item => item.name);
    const products = await Product.find({ 'name of product': { $in: productNames } });
    // console.log(productNames);
    // console.log(products);


    res.render('WishList', { cartItems, products });
  } catch (error) {
    console.error('Error retrieving product data:', error);
    res.send('Error retrieving product data');
  }
});


router.post('/',async(req,res)=>{
  const cartItems = req.cookies.ProductWishList || [];
  const username = req.cookies.username;
  console.log("object2");
    // Clear the cart items
    res.clearCookie('ProductWishList');
    res.redirect('/WishList'); // Redirect to the orders page or any other desired destination
})

router.post('/delete', (req, res) => {
  console.log("object");
  const { itemName } = req.body;
  const cartItems = req.cookies.ProductWishList || [];

  // Find the index of the item to be deleted in the cart
  const itemIndex = cartItems.findIndex(item => item.name === itemName);

  if (itemIndex !== -1) {
    // Remove the item from the cart
    cartItems.splice(itemIndex, 1);
  }

  // Update the 'ProductCart' cookie with the modified cart
  res.cookie('ProductWishList', cartItems);

  // Redirect back to the same page
  res.redirect('/WishList');
});
  
  
module.exports = router;


  