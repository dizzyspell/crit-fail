var express = require('express')
var app = express()
const path = require('path')
const PORT = process.env.PORT || 5000
const { Pool } = require('pg')
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: true
})
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
	res.send('crit fail B)')
})

app
	.get('/characters', async (req, res) => {
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
	.post('/characters', upload.array(), async (req, res) => {
		try {
			const client = await pool.connect();
			console.log(req.body)
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

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))