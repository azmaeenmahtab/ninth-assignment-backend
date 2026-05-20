const express = require('express');
const { client } = require('../db');

const router = express.Router();

router.post('/request-adoption', async (req, res) => {
    try {
        const {
            petId,
            petName,
            petImageSrc,
            userId,
            ownerId,
            userName,
            userEmail,
            pickupDate,
            message
        } = req.body || {};

        if (!petId || !userId || !ownerId) {
            return res.status(400).json({ success: false, message: 'Missing required fields.' });
        }

        if (userId === ownerId) {
            return res.status(403).json({ success: false, message: 'Owner cannot request for adoption.' });
        }

        const existingRequest = await client
            .db()
            .collection('adoption-requests')
            .findOne({ petId, userId });

        if (existingRequest) {
            return res.status(409).json({ success: false, message: 'You have already requested this pet.' });
        }

        const requestDoc = {
            petId,
            petName: petName || '',
            petImageSrc: petImageSrc || '',
            userId,
            ownerId,
            userName: userName || '',
            userEmail: userEmail || '',
            pickupDate: pickupDate || '',
            message: message || '',
            status: 'pending',
            createdAt: new Date()
        };

        const result = await client.db().collection('adoption-requests').insertOne(requestDoc);

        res.status(201).json({ success: true, requestId: result.insertedId });
    } catch (error) {
        console.error('Error creating adoption request:', error);
        res.status(500).json({ success: false, message: 'Failed to submit request', error: error.message });
    }
});

router.delete('/request-adoption', async (req, res) => {
    try {
        const { petId, userId } = req.query || {};

        if (!petId || !userId) {
            return res.status(400).json({ success: false, message: 'petId and userId are required.' });
        }

        const result = await client
            .db()
            .collection('adoption-requests')
            .deleteOne({ petId, userId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'Request not found.' });
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error deleting adoption request:', error);
        res.status(500).json({ success: false, message: 'Failed to cancel request', error: error.message });
    }
});

module.exports = router;
