const { Pool } = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
})

const db = {
    characterIds: [],
    columns: [
        "name",
        "description",
        "abilities",
        "skills",
        "inventory",
        "spells",
        "features",
        "proficiencies",
        "battlestats",
        "notes"
    ],

    fetch: async function () {
        //console.log('fetching...')
        let characterIds = await this.query(`SELECT "characterId" FROM characters;`)
        this.characterIds = characterIds.map(row => row.characterId)
        return this
    },

    prefetch: async function(res, req, next) {
        try {
            //console.log('prefetching some data...')
            await db.fetch()
            next()
        } catch (err) {
            console.error(err);
            next()
        }
    },

    query: async function (queryText) {
        try {
            const client = await pool.connect();
            const result = await client.query(queryText);
            return (result) ? result.rows : null;
            client.release();
        } catch (err) {
            throw err;
        }
    }
}

module.exports = db