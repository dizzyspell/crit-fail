const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 5000

const characters = require('./characters')
const stats = require('./stats')

app
	.use('/characters', characters)
	.use('/stats', stats)

// homepage
app.get('/', function (req, res) {
	res.send('crit fail B)')
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))