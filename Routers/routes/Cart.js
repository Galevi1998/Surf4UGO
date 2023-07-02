const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const Product = require("../../product");
const Order = require("../../orders");

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


router.post('/',async(req,res)=>{
  console.log("Order");

  const buttonText = req.body.action;
  console.log(buttonText);

  if (buttonText === 'delete') {
    const { itemName } = req.body;
    const cartItems = req.cookies.ProductCart || [];
  
    // Find the index of the item to be deleted in the cart
    const itemIndex = cartItems.findIndex(item => item.name === itemName);
  
    if (itemIndex !== -1) {
      // Remove the item from the cart
      cartItems.splice(itemIndex, 1);
    }
  
    // Update the 'ProductCart' cookie with the modified cart
    res.cookie('ProductCart', cartItems);
  
    // Redirect back to the same page
    res.redirect('/Cart');
  }
  else{
    const cartItems = req.cookies.ProductCart || [];
    const username = req.cookies.username;
  
    try {
      // Generate a unique order number
      const orderNumber = Math.floor(Math.random() * 1000000);
  
      // Create an array to store the order items
      const orderItems = [];
  
      // Iterate over each item in the cart
      for (const cartItem of cartItems) {
        // Retrieve the corresponding product from the database
        const product = await Product.findOne({ 'name of product': cartItem.name });
  
        // Calculate the total price for the order item
        const totalPrice = product.price * cartItem.quantity;
  
        // Create a new order item object
        const orderItem = {
          name: username,
          ordernumber: orderNumber,
          'name of product': product['name of product'],
          price: product.price,
          picture: product.picture,
          quantity: cartItem.quantity
        };
  
        // Add the order item to the array
        orderItems.push(orderItem);
      }
  
      // Insert the order items into the orders collection
      await Order.insertMany(orderItems);
  
      // Clear the cart items
      res.clearCookie('ProductCart');
  
      res.redirect('/Cart'); // Redirect to the orders page or any other desired destination
    } catch (error) {
      console.error('Error adding order to database:', error);
      res.send('Error adding order to database');
    } 
  }
})
// ...

router.post('/delete', (req, res) => {
  console.log("object");
  const { itemName } = req.body;
  const cartItems = req.cookies.ProductCart || [];

  // Find the index of the item to be deleted in the cart
  const itemIndex = cartItems.findIndex(item => item.name === itemName);

  if (itemIndex !== -1) {
    // Remove the item from the cart
    cartItems.splice(itemIndex, 1);
  }

  // Update the 'ProductCart' cookie with the modified cart
  res.cookie('ProductCart', cartItems);

  // Redirect back to the same page
  res.redirect('/Cart');
});

// ...


module.exports = router;


  