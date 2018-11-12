const express = require('express')
const router = express.Router()
const path = require('path')
const { Pool } = require('pg')
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: true
})
const bodyParser = require('body-parser');
const multer = require('multer'); // v1.0.5
const upload = multer(); // for parsing multipart/form-data 

module.exports = router
	.use(bodyParser.json()) // for parsing application/json
	.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
	.get('/', async (req, res) => {
		try {
			const client = await pool.connect();
			const result = await client.query('SELECT * FROM characters;');
			const results = { 'results': (result) ? result.rows : null};
			res.send(results);
			client.release();
		} catch (err) {
			console.error(err);
			res.send("Error " + err);
		}
	})
	.post('/', upload.array(), async (req, res) => {
		try {
			const client = await pool.connect();
			const queryString = `insert into characters (name, class, level) values ('${req.body.name}', '${req.body.class}', ${req.body.level}) returning character_id;`
			const result = await client.query(queryString);
			const newChar = { 'characterId': result.rows[0].character_id}
			res.status(201).send(newChar);
			client.release();
		} catch (err) {
			console.error(err);
			res.send("Error " + err);
		}
	})
	.get('/:characterId', async (req, res) => {
		try {
			const characterId = req.params.characterId
			const client = await pool.connect();
			const result = await client.query(`SELECT * FROM characters where character_id=${characterId};`);
			const results = { 'results': (result) ? result.rows : null};
			res.send(results);
			client.release();
		} catch (err) {
			console.error(err);
			res.send("Error " + err);
		}
	})