const KEY = process.env.KEY
const {error, respond} = require('./response')
const {logMessage} = require('./logger')

module.exports = (req, res, next) => {
	const key = req.query.key
	if (error._403(key != KEY, next)) return
	else {
		logMessage('passed key check')
		next()
	}
}