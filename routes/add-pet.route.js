const express = require('express');
const { client } = require('../db');
const VerifyTokenMiddleware = require('../middlewares/verifyTokenMiddleware');

const router = express.Router();

router.post('/add-pet', VerifyTokenMiddleware, async (req, res) => {
  try {
    const petData = req.body;
    const result = await client.db().collection('pets').insertOne(petData);
    res.status(201).json({ success: true, message: 'Pet added successfully', petId: result.insertedId });
  } catch (error) {
    console.error('Error adding pet:', error);
    res.status(500).json({ success: false, message: 'Failed to add pet', error: error.message });
  }
});

module.exports = router;