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

  try {
    // Retrieve the product data from the database for each product in the cart
    const productNames = cartItems.map(item => item.name);
    const products = await Product.find({ 'name of product': { $in: productNames } });
    // console.log(productNames);
    console.log(cartItems);

    res.render('Cart', { cartItems, products });
  } catch (error) {
    console.error('Error retrieving product data:', error);
    res.send('Error retrieving product data');
  }
});

router.post('/', async (req, res) => {
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
  } else if (buttonText === 'Q') {
    const itemName = req.body.itemName2;
    const quantity = req.body[`quantity-${itemName}`];

    const cartItems = req.cookies.ProductCart || [];

    // Find the index of the item to be deleted in the cart
    const itemIndex = cartItems.findIndex(item => item.name === itemName);
    console.log(cartItems);

    if (itemIndex !== -1) {
      // Remove the item from the cart
      cartItems.splice(itemIndex, 1);
    }

    // Add the item back with the updated quantity
    cartItems.push({ name: itemName, quantity: parseInt(quantity) });
    console.log(cartItems);

    // Update the cookie with the updated cart items
    res.cookie('ProductCart', cartItems);

    // Redirect to the Cart page or perform any other necessary actions
    res.redirect('/Cart');
  } else {
    const cartItems = req.cookies.ProductCart || [];
    const username = req.cookies.username;

    // Check if the user is logged in
    if (!username) {
      // User is not logged in, redirect to the signup page
      res.clearCookie('ProductCart');
      return res.redirect('/signup');
    }

    try {
      const orderNumber = Math.floor(Math.random() * 1000000);
      const orderItems = [];

      for (const cartItem of cartItems) {
        const productName = cartItem.name; // Retrieve the product name from the cart item

        const product = await Product.findOne({ 'name of product': productName });

        if (product) {
          const selectedQuantity = parseInt(cartItem.quantity); // Use the quantity from the cart item

          if (selectedQuantity > 0 && selectedQuantity <= product.quantity) {
            // Update the quantity of the product in the cart
            cartItem.quantity = selectedQuantity;

            // Subtract the ordered quantity from the product quantity in the database
            product.quantity -= selectedQuantity;

            // Save the updated product in the database
            await product.save();

            const orderItem = {
              name: username,
              ordernumber: orderNumber,
              'name of product': product['name of product'],
              price: product.price,
              picture: product.picture,
              quantity: selectedQuantity
            };

            orderItems.push(orderItem);
          } else {
            // Insufficient quantity or invalid selected quantity, handle accordingly (e.g., show error message)
            console.error('Insufficient quantity or invalid selected quantity for:', productName);
          }
        } else {
          // Product not found, handle accordingly (e.g., show error message)
          console.error('Product not found:', productName);
        }
      }

      await Order.insertMany(orderItems);
      res.clearCookie('ProductCart');
      res.redirect('/Cart');
    } catch (error) {
      console.error('Error adding order to database:', error);
      res.send('Error adding order to database');
    }
  }
});

router.post('/delete', (req, res) => {
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

router.post('/Quantity', (req, res) => {
  const itemName = req.body.itemName2;
  const quantity = req.body[`quantity-${itemName}`];

  const cartItems = req.cookies.ProductCart || [];

  // Find the index of the item to be deleted in the cart
  const itemIndex = cartItems.findIndex(item => item.name === itemName);

  if (itemIndex !== -1) {
    // Remove the item from the cart
    cartItems.splice(itemIndex, 1);
  }

  // Add the item back with the updated quantity
  cartItems.push({ name: itemName, quantity: parseInt(quantity) });

  // Update the cookie with the updated cart items
  res.cookie('ProductCart', cartItems);

  // Redirect to the Cart page or perform any other necessary actions
  res.redirect('/Cart');
});

// ...

module.exports = router;
