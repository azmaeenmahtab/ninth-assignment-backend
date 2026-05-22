const express = require('express');
const { client } = require('../db');
const VerifyTokenMiddleware = require('../middlewares/verifyTokenMiddleware');

const router = express.Router();

router.get('/get-listing', VerifyTokenMiddleware, async (req, res) => {
	try {
		const { userId, ownerEmail } = req.query;

		if (!userId && !ownerEmail) {
			return res.status(400).json({ success: false, message: 'userId or ownerEmail is required' });
		}

		const query = {};
		if (userId) query.userId = userId;
		if (ownerEmail) query.ownerEmail = ownerEmail;

		const listings = await client.db().collection('pets').find(query).toArray();
		res.status(200).json({ success: true, listings });
	} catch (error) {
		console.error('Error fetching listings:', error);
		res.status(500).json({ success: false, message: 'Failed to fetch listings', error: error.message });
	}
});

module.exports = router;
