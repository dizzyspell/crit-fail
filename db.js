const { Pool } = require('pg')
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: true
})

module.exports = async (queryText) => {
	try {
		const client = await pool.connect();
		const result = await client.query(queryText);
		return (result) ? result.rows : null;
		client.release();
	} catch (err) {
		throw err;
	}
}