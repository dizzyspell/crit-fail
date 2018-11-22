const express = require('express')
const router = express.Router()

const {error, respond} = require('../../utils/response')
const {logMessage} = require('../../utils/logger')
const db = require('../../utils/db')
const checkKey = require('../../utils/checkKey')
const validator = require('../../utils/validator')

module.exports = router

	.get('/', async (req, res, next) => {
        try {
            const results = 'users'
            respond._200(results, next);
        } catch (err) {
            console.error(err);
            error._500(true, next, err)
        }
	})