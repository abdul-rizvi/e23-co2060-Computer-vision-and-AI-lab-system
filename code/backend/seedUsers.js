const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
      }
);

const users = [
  { name: "Alice Student",  email: "student@lab.com",  password: "student123",  role: "student" },
  { name: "Bob Officer",    email: "officer@lab.com",  password: "officer123",  role: "officer" },
  { name: "Carol Admin",    email: "admin@lab.com",    password: "admin123",    role: "admin"   },
];

async function seedUsers() {
  console.log("Seeding test users...\n");
  for (const u of users) {
    const hashed = await bcrypt.hash(u.password, 10);
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [u.email]);
    if (existing.rows.length > 0) {
      console.log(`  ⚠  ${u.role.padEnd(8)} ${u.email} already exists — skipping.`);
      continue;
    }
    await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
      [u.name, u.email, hashed, u.role]
    );
    console.log(`  ✓  ${u.role.padEnd(8)} ${u.email}  /  password: ${u.password}`);
  }
  console.log("\nDone.");
  await pool.end();
}

seedUsers().catch(err => {
  console.error("Seed failed:", err.message);
  pool.end();
});
