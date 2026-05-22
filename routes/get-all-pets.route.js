const express = require('express');
const { client } = require('../db');

const router = express.Router();

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

router.get('/all-pets', async (req, res) => {
	try {
		const { search, species } = req.query;
		const query = {};

		if (search && search.trim()) {
			query.petName = { $regex: search.trim(), $options: 'i' };
		}

		if (species && species.trim()) {
			const speciesList = species
				.split(',')
				.map((value) => value.trim())
				.filter(Boolean);

			if (speciesList.length) {
				const speciesRegexes = speciesList.map(
					(item) => new RegExp(`^${escapeRegex(item)}$`, 'i')
				);
				query.species = { $in: speciesRegexes };
			}
		}

		const pets = await client.db().collection('pets').find(query).toArray();
		res.status(200).json({ success: true, pets });
	} catch (error) {
		console.error('Error fetching pets:', error);
		res.status(500).json({ success: false, message: 'Failed to fetch pets', error: error.message });
	}
});

module.exports = router;
