const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 5000

const db = require('./utils/db')
const {logRequest, logResponse} = require('./utils/logger')
const bodyParser = require('body-parser');

db.fetch()

app
	// request logger
	.use( logRequest )
	// json parser
	.use( bodyParser.json() )

const characters = require('./routes/characters/charactersRouter')

app.use('/characters', characters)

// homepage
app.get('/', function (req, res) {
	res.send('crit fail B)')
})

app.use( logResponse )

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))