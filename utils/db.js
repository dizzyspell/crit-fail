const { Pool } = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
})
const {logMessage} = require('./logger')

let DbBusy = false

const db = {
    characterIds: [],
    columns: [
        "name",
        "description",
        "abilities",
        "skills",
        "savingThrows",
        "inventory",
        "spells",
        "features",
        "proficiencies",
        "battlestats",
        "notes"
    ],

    fetch: async function () {
        let characterIds = await this.query(`SELECT "characterId" FROM characters;`)
        this.characterIds = characterIds.map(row => row.characterId)
        return this
    },

    prefetch: async function(res, req, next) {
        try {
            logMessage('prefetching some data...')
            await db.fetch()
            next()
        } catch (err) {
            console.error(err);
            next()
        }
    },

    query: async function (queryText) {
        try {
            if (!DbBusy) {
                DbBusy = true
                const client = await pool.connect();
                const result = await client.query(queryText);
                client.release();
                DbBusy = false
                return (result) ? result.rows : null;
            } else {
                logMessage(`db busy; staging query ${queryText.slice(0,21)}...`)
                await this.timeout(100)
                return await this.query(queryText)
            }
        } catch (err) {
            throw err;
        }
    },

    timeout: function (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = db