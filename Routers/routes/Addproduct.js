const express = require("express");
const path = require("path");
const router = express.Router();
const cookieParser = require('cookie-parser');
const Product = require("../../product");



router.get('/',(req,res)=>{
  console.log('asdsadasd');
  res.render('Addproduct');
})
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
