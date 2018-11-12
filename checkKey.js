const KEY = process.env.KEY

module.exports = (req, res, next) => {
	const key = req.query.key
	if (!key || key != KEY) {
		res.sendStatus(403)
	} else {
		next()
	}
}