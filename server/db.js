const Pool = require("pg").Pool;
require("dotenv").config();

const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
};

const pool = new Pool(dbConfig);

module.exports = pool;