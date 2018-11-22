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
                const char = await Character.createNew(req.body.name)
                respond._201(char.sheet, next);
            } catch (err) {
                console.error(err);
                error._500(true, next, err)
            }
        }
    )

    .get('/random', async (req, res, next) => {
        try {
            const char = await Character.getRandom()
            respond._200(char, next);
        } catch (err) {
            console.error(err);
            error._500(true, next, err)
        }
    })

    .get('/:characterId', db.prefetch, async (req, res, next) => {
        try {
            const characterId = parseInt(req.params.characterId)

            if (error._404(!db.characterIds.includes(characterId), next)) return

            let char = await Character.getById(characterId)

            if(error._404(!char, next)) return
            else respond._200(char.sheet, next)
        } catch (err) {
            console.error(err);
            error._500(true, next, err)
        }
    })

    .get('/:characterId/:column', db.prefetch, async (req, res, next) => {
        try {
            const characterId = parseInt(req.params.characterId)
            const column = req.params.column

            if (error._404(
                !db.columns.includes(column) ||
                !db.characterIds.includes(characterId), next)) return

            let char = await Character.getById(characterId)

            if(error._404(!char, next)) return
            else respond._200(char.sheet[column], next);
        } catch (err) {
            console.error(err);
            error._500(true, next, err)
        }
    })

    .put('/:characterId/:column', checkKey, db.prefetch, async (req, res, next) => {
        try {
            const characterId = parseInt(req.params.characterId)
            const column = req.params.column
            const body = req.body[column]

            if (error._404(
                !db.columns.includes(column) || 
                !db.characterIds.includes(characterId), next)) return
            if (error._400(!body, next)) return

            const data = validator.validate(statsSchema[column], body)

            if (error._400(!data.valid, next, data.errors)) return
            else {
                logMessage('passed JSON validation')
                let char = await Character.getById(characterId)
                const results = char.update(column, data.json)
                respond._200(results, next)                
            }
        } catch (err) {
            console.error(err);
            error._500(true, next, err)
        }
    })