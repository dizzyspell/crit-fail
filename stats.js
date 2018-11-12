const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser');

const db = require('./db')
const checkKey = require('./checkKey')

module.exports = router
	.use(bodyParser.json()) // for parsing application/json

	.get('/', (req, res) => {
		res.send('stats endpoint')
	})
	.get('/:characterId', async (req, res) => {
		try {
			const characterId = req.params.characterId
			const results = await db(`SELECT stats FROM characters WHERE character_id=${characterId};`);
			res.send(results[0]);
		} catch (err) {
			console.error(err);
			res.send("Error " + err);
		}
	})
	.put('/:characterId', checkKey, async (req, res) => {
		try {
			const characterId = req.params.characterId
			const stats = JSON.stringify(req.body.stats)
			console.log(stats)
			if (stats) {
				console.log(`UPDATE characters SET stats='${stats}' WHERE character_id=${characterId};`)
				const results = await db(`UPDATE characters SET stats='${stats}' WHERE character_id=${characterId};`)
				res.status(200).send(results)
			} else {
				res.sendStatus(204)
			}
		} catch (err) {
			console.error(err);
			res.send("Error " + err);
		}
	})