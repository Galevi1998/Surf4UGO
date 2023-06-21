const mongoose = require('mongoose');

// Define the Product schema
const myschema = new mongoose.Schema({
    "name of product": {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    picture: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  }, { versionKey: false });
// Create the Product model using the schema
const Product = mongoose.model('Product', myschema);

module.exports = Product;
