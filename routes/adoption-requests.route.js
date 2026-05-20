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

router.get("/pet-adoption-requests", async (req, res) => {
    try {
        const petId = req.query.petId;
        if (!petId) {
            return res.status(400).json({ success: false, message: 'petId is required' });
        }

        const requests = await client
            .db()
            .collection('adoption-requests')
            .find({ petId })
            .sort({ createdAt: -1 })
            .toArray();

        res.status(200).json({ success: true, requests });
    } catch (error) {
        console.error('Error fetching pet adoption requests:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch requests', error: error.message });
    }
});

router.patch("/approve-adoption-request", async (req, res) => {
    try {
        const { petId, userId } = req.body || {};
        if (!petId || !userId) {
            return res.status(400).json({ success: false, message: 'petId and userId are required' });
        }

        const result = await client
            .db()
            .collection('adoption-requests')
            .updateOne({ petId, userId }, { $set: { status: 'approved' } });

        if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error approving adoption request:', error);
        res.status(500).json({ success: false, message: 'Failed to approve request', error: error.message });
    }
});

module.exports = router;