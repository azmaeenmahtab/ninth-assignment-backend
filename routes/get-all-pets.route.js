const express = require('express');
const { client } = require('../db');

const router = express.Router();

router.get('/all-pets', async (req, res) => {
	try {
		const pets = await client.db().collection('pets').find({}).toArray();
		res.status(200).json({ success: true, pets });
	} catch (error) {
		console.error('Error fetching pets:', error);
		res.status(500).json({ success: false, message: 'Failed to fetch pets', error: error.message });
	}
});

module.exports = router;
