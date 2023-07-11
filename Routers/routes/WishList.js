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
  const buttonText = req.body.action;
  console.log(buttonText);
  const action = req.body.action;
  if (action) {
    const [actionType, productName] = action.split(':');

  if (buttonText === 'delete') {
    console.log("Go");
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
  }
  else if(actionType === 'cart'){
    console.log("Go");
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

      const { itemName } = req.body;
      const cartItems = req.cookies.ProductWishList || [];
    
      // Find the index of the item to be deleted in the cart
      const itemIndex = cartItems.findIndex(item => item.name === itemName);
    
      if (itemIndex !== -1) {
        // Remove the item from the cart
        cartItems.splice(itemIndex, 1);
      
    }
}
  else{
    console.log("GalClear");
    const cartItems = req.cookies.ProductWishList || [];
    const username = req.cookies.username;
      // Clear the cart items
      res.clearCookie('ProductWishList');
      res.redirect('/WishList'); // Redirect to the orders page or any other desired destination
  }
}
});

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
      res.redirect('/WishList');    }
  }
});

  // router.post('/Addto', (req, res) => {
  // const action = req.body.action;

  // if (action) {
  //   const [actionType, productName] = action.split(':');

  //   if (actionType === 'cart') {
  //     // Retrieve the existing cart items from the cookie
  //     const existingCart = req.cookies.ProductCart || [];

  //     // Check if the product already exists in the cart
  //     const existingProductIndex = existingCart.findIndex(item => item.name === productName);

  //     if (existingProductIndex !== -1) {
  //       // If the product already exists, update its quantity
  //       existingCart[existingProductIndex].quantity += 1;
  //     } else {
  //       // If the product doesn't exist, add it with quantity 1
  //       existingCart.push({ name: productName, quantity: 1 });
  //     }

  //     // Set the updated cart items to the "ProductCart" cookie
  //     res.cookie('ProductCart', existingCart, { maxAge: 86400000 }); // Cookie expires in 24 hours

  //     // Log the value of the "ProductCart" cookie
  //     console.log('ProductCart:', existingCart);

  //     res.redirect('/allproducts');
  //   }
module.exports = router;


  