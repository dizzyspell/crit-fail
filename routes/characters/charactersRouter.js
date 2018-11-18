const express = require('express')
const router = express.Router()

const {error, respond} = require('../../utils/response')
const {logMessage} = require('../../utils/logger')
const db = require('../../utils/db')
const checkKey = require('../../utils/checkKey')
const validator = require('../../utils/validator')

const statsSchema = require('./statsSchema')
const Character = require('./charactersModel')

module.exports = router 

    .get('/', async (req, res, next) => {
        try {
            const results = await db.query('SELECT "characterId", name FROM characters;')
            respond._200(results, next);
        } catch (err) {
            console.error(err);
            error._500(true, next, err)
        }
    })

    .post('/', checkKey, validator.prevalidate({
            "type": "object",
            "required": ["name"],
            "properties": {
                "name": {"type": "string"}
            }
        }), 
        async (req, res, next) => {
            try {
                const results = await db.query(`INSERT INTO characters(name) VALUES ('${req.body.name}') RETURNING "characterId";`);
                const newChar = { 'characterId': results[0].characterId}
                respond._201(newChar, next);
            } catch (err) {
                console.error(err);
                error._500(true, next, err)
            }
        }
    )

    .get('/:characterId', db.prefetch, async (req, res, next) => {
        try {
            const characterId = parseInt(req.params.characterId)

            if (error._404(!db.characterIds.includes(characterId), next)) return

            let char = await Character(characterId)

            if(error._404(!char, next)) return
            else respond._200(char, next)
        } catch (err) {
            console.error(err);
            error._500(true, next, err)
        }
    })

    .get('/:characterId/:column', db.prefetch, async (req, res, next) => {
        try {
            const characterId = parseInt(req.params.characterId)
            const column = req.params.column.toLowerCase()

            if (error._404(
                !db.columns.includes(column) ||
                !db.characterIds.includes(characterId), next)) return

            let char = await Character(characterId)

            if(error._404(!char, next)) return
            else respond._200(char[column], next);
        } catch (err) {
            console.error(err);
            error._500(true, next, err)
        }
    })

    .put('/:characterId/:column', checkKey, db.prefetch, async (req, res, next) => {
        try {
            const characterId = parseInt(req.params.characterId)
            const column = req.params.column.toLowerCase()
            const body = req.body[column]

            if (error._404(
                !db.columns.includes(column) || 
                !db.characterIds.includes(characterId), next)) return
            if (error._400(!body, next)) return

            const data = validator.validate(statsSchema[column], body)

            if (error._400(!data.valid, next, data.errors)) return
            else {
                logMessage('passed JSON validation')
                const jsonString = JSON.stringify(data.json)
                let char = await Character(characterId)
                const results = await char.update(column, jsonString)
                respond._200(results, next)                
            }
        } catch (err) {
            console.error(err);
            error._500(true, next, err)
        }
    })