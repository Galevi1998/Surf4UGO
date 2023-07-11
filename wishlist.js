const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    name: String,
    ordernumber: Number,
    "name of product": String,
    price: Number,
    picture: String,
    quantity: Number
  }, { collection: 'wishlist' });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;