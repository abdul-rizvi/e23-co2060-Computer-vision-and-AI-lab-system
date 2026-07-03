const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
      }
);

async function runSchema() {
  const schemaPath = path.join(__dirname, "sql", "schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf8");

  console.log("Connecting to database...");
  try {
    await pool.query("SELECT 1");
    console.log("Connected.");
    console.log("Running schema...");
    await pool.query(sql);
    console.log("Schema applied successfully.");
  } catch (err) {
    console.error("Error running schema:", err.message);
  } finally {
    await pool.end();
  }
}

runSchema();
