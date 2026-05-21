const express = require('express');
const { ObjectId } = require('mongodb');
const { client } = require('../db');

const router = express.Router();

router.delete('/delete-listing', async (req, res) => {
    try {
        const petId = req.query.petId;
        if (!petId) {
            return res.status(400).json({ success: false, message: 'petId is required' });
        }

        const result = await client
            .db()
            .collection('pets')
            .deleteOne({ _id: new ObjectId(petId) });

        if (!result.deletedCount) {
            return res.status(404).json({ success: false, message: 'Pet not found' });
        }

        res.status(200).json({ success: true, message: 'Pet deleted successfully' });
    } catch (error) {
        console.error('Error deleting pet:', error);
        res.status(500).json({ success: false, message: 'Failed to delete pet', error: error.message });
    }
});

module.exports = router;
