const LOG_LEVEL = process.env.LOG_LEVEL

module.exports = {
	logRequest: (req, res, next) => {
		if (LOG_LEVEL >= 2) console.log(`${req.method} ${req.originalUrl}`)
		next();
	},
	
	logResponse: (msg, req, res, next) => {
		if (LOG_LEVEL >= 2) {
			console.log(`<= ${msg.status}`)
			res.status(msg.status).send(msg.body)
		}
	},

	logMessage: (message) => {
		if (LOG_LEVEL >= 3) console.log(` = ${message}`)
	}
}