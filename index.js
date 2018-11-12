const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 5000

var characters = require('./characters')

app.use('/characters', characters)

// homepage
app.get('/', function (req, res) {
	res.send('crit fail B)')
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))