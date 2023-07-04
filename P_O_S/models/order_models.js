// order_model.js

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Define the schema for the Order model
  // ...
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
