// shipment.routes.js
const express = require('express');
const router = express.Router();
const Shipment = require('./shipment_model');

// GET /shipments
router.get('/', async (req, res) => {
  try {
    // Fetch shipments from the database
    const shipments = await Shipment.find();

    // Render the shipments template and pass the shipments data
    res.render('shipments', { shipments });
  } catch (error) {
    console.error('Failed to fetch shipments:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Create a new shipment
router.post('/', async (req, res) => {
  try {
    const shipment = await Shipment.create(req.body);
    res.status(201).json(shipment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create shipment' });
  }
});

// Get all shipments
router.get('/', async (req, res) => {
  try {
    const shipments = await Shipment.find();
    res.json(shipments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve shipments' });
  }
});

// Update a shipment
router.put('/:id', async (req, res) => {
  try {
    const shipment = await Shipment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(shipment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update shipment' });
  }
});

// Delete a shipment
router.delete('/:id', async (req, res) => {
  try {
    await Shipment.findByIdAndRemove(req.params.id);
    res.json({ message: 'Shipment deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete shipment' });
  }
});

module.exports = router;
