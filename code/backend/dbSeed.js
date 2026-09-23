require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('./config/db');

const seedDB = async () => {
    try {
        const schemaPath = path.join(__dirname, 'sql', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        console.log("Executing schema.sql...");
        await pool.query(schema);
        console.log("Database seeded successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Error seeding database:", err);
        process.exit(1);
    }
};

seedDB();
