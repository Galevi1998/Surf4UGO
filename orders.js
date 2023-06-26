const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  name: String,
  ordernumber: Number,
  "name of product": String,
  price: Number,
  picture: String,
  quantity: Number
}, { collection: 'orders' });

const Order = mongoose.model("Orders", orderSchema);

module.exports = Order;
