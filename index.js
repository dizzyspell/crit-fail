const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 5000

const db = require('./utils/db')
const {logRequest, logResponse} = require('./utils/logger')
const {respond} = require('./utils/response')
const bodyParser = require('body-parser');

db.fetch()

app
	// request logger
	.use( logRequest )
	// json parser
	.use( bodyParser.json() )

const characters = require('./routes/characters/charactersRouter')
const users = require('./routes/users/usersRouter')

app.use('/characters', characters)
app.use('/users', users)

// homepage
app.get('/', function (req, res, next) {
	respond._200('crit fail :3', next)
})

app.use( logResponse )

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))