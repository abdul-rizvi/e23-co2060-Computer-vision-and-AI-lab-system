const { Pool, types } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

// Calendar dates must not be converted to local-midnight timestamps.
types.setTypeParser(1082, value => value);

const pool = new Pool(
    process.env.DATABASE_URL 
    ? { 
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false } // Required for Neon
      }
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
      }
);

module.exports = pool;
