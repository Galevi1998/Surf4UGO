const express = require("express");
const path = require("path");
const router = express.Router();
const cookieParser = require('cookie-parser');
const updateproduct = require("../../product");


router.get('/',(req,res)=>{
  console.log('Got into update');
  res.render('updateproducts');
})

router.post('/', async (req, res) => {
  // Retrieve the product data from the request body
  const productData = req.body;

  // Check if any field is empty
  for (const key in productData) {
    if (!productData[key]) {
      return res.send('Please fill in all fields');
    }
  }

  try {
    // Check if a product with the same name already exists
    const existingProduct = await updateproduct.findOne({ "name of product": productData["name of product"] });

    if (existingProduct) {
      // Update the existing product with the new data
      existingProduct.set(productData);
      await existingProduct.save();
      return res.send('Product updated successfully');
    } else {
      return res.send('Please try updating products that already exist');
    }
  } catch (error) {
    // Handle any errors that occur during saving or updating
    console.error('Error saving/updating product:', error);
    res.status(500).send('Error saving/updating product');
  }
});
  

module.exports = router;
