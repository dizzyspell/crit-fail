const {error, respond} = require('./response')
const Ajv = require('ajv')
const ajv = new Ajv()
const {logMessage} = require('./logger')

module.exports = {
	prevalidate: (schema) => {
		return (req, res, next) => {
			let validate = ajv.compile(schema);
			let valid = validate(req.body);
			const errors = validate.errors.map( error => error.message )
			if (error._400(!valid, next, errors)) return
			else {
				logMessage('passed JSON validation')
				next()
			}
		}
	},

	validate: (schema, json) => {
		const validate = ajv.compile(schema);
		const valid = validate(json);
		const errors = validate.errors ? validate.errors.map( (error) => (error.message) ) : null

		return {
			json: json,
			valid: valid,
			errors: errors
		}
	}

}