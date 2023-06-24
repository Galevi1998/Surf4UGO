const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const Product = require("../../product");

// GET route for searching products
router.get('/', async (req, res) => {
  res.render('search'); // Assuming you have a search.ejs view file
});

// POST route for searching products
// POST route for searching products
router.post('/search', async (req, res) => {
    try {
      const searchValue = req.body.searchValue;
      const products = await Product.find({ "name of product": { $regex: searchValue, $options: 'i' } }).limit(10);
      res.json(products);
    } catch (error) {
      console.error("Failed to search products:", error);
      res.status(500).json({ error: "Failed to search products" });
    }
  });
  

module.exports = router;
