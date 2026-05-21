const express = require('express');
const { ObjectId } = require('mongodb');
const { client } = require('../db');

const router = express.Router();

router.put('/update-pet', async (req, res) => {
    try {
        const petId = req.query.petId;
        if (!petId) {
            return res.status(400).json({ success: false, message: 'petId is required' });
        }

        const updates = req.body || {};
        delete updates._id;

        if (!Object.keys(updates).length) {
            return res.status(400).json({ success: false, message: 'No update data provided' });
        }

        const result = await client
            .db()
            .collection('pets')
            .updateOne({ _id: new ObjectId(petId) }, { $set: updates });

        if (!result.matchedCount) {
            return res.status(404).json({ success: false, message: 'Pet not found' });
        }

        res.status(200).json({ success: true, message: 'Pet updated successfully' });
    } catch (error) {
        console.error('Error updating pet:', error);
        res.status(500).json({ success: false, message: 'Failed to update pet', error: error.message });
    }
});

module.exports = router;
