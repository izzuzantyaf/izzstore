const { Pool } = require('pg')
const dotenv = require('dotenv')
const tables = require('./tables')

dotenv.config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

pool
  .on('connect', () => { })
  .on('error', (err) => {
    console.error(err.message)
  })

exports.query = (query, params) => {
  pool.query(query, params)
}

exports.setup = () => {
  // setup tables
  tables.setupQueries.forEach((setupQuery) => {
    pool.query(setupQuery)
  })
}