const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser');

const db = require('./db')
const checkKey = require('./checkKey')

module.exports = router
	.use(bodyParser.json()) // for parsing application/json
	
	.get('/', async (req, res) => {
		try {
			const results = await db('SELECT character_id, name FROM characters;')
			res.send(results);
		} catch (err) {
			console.error(err);
			res.send("Error " + err);
		}
	})
	.post('/', checkKey, async (req, res) => {
		try {
			const results = await db(`insert into characters(name, stats) values ('${req.body.name}', '{"level":1}') returning character_id;`);
			const newChar = { 'characterId': results[0].character_id}
			res.status(201).send(newChar);
		} catch (err) {
			console.error(err);
			res.send("Error " + err);
		}
	})
	.get('/:characterId', async (req, res) => {
		try {
			const characterId = req.params.characterId
			const results = await db(`SELECT * FROM characters where character_id=${characterId};`);
			res.send(results[0]);
		} catch (err) {
			console.error(err);
			res.send("Error " + err);
		}
	})