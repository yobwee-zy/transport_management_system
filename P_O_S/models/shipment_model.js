// shipment.model.js
const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  sender: {
    type: String,
    required: true,
  },
  recipient: {
    type: String,
    required: true,
  },
  pickupAddress: {
    type: String,
    required: true,
  },
  deliveryAddress: {
    type: String,
    required: true,
  },
  carrier: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Transit', 'Delivered'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Shipment', shipmentSchema);
