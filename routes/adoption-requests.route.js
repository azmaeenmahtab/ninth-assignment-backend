const express = require('express');
const { client } = require('../db');

const router = express.Router();

router.get("/my-adoption-requests", async (req, res) => {
    try {
        const userId = req.query.userId; // Assuming you pass the user ID as a query parameter
        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }
        const requests = await client.db().collection('adoption-requests').find({ userId }).toArray();
        res.status(200).json({ success: true, requests });
    } catch (error) {
        console.error('Error fetching adoption requests:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch adoption requests', error: error.message });
    }
});

module.exports = router;