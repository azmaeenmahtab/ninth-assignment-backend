const express = require('express');
const { ObjectId } = require('mongodb');
const { client } = require('../db');

const router = express.Router();

router.get('/pet-detail', async (req, res) => {
    try {
        const petId = req.query.petId;
        if (!petId) {
            return res.status(400).json({ success: false, message: 'petId is required' });
        }

        const pet = await client
            .db()
            .collection('pets')
            .findOne({ _id: new ObjectId(petId) });

        if (!pet) {
            return res.status(404).json({ success: false, message: 'Pet not found' });
        }

        res.status(200).json({ success: true, pet });
    } catch (error) {
        console.error('Error fetching pet:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch pet', error: error.message });
    }
});

module.exports = router;
