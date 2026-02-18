
import { Client } from 'pg';
import "dotenv/config";

async function main() {
    console.log("Testing connection to:", process.env.DATABASE_URL);
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });

    try {
        await client.connect();
        console.log("✅ Successfully connected to Postgres!");
        const res = await client.query('SELECT NOW()');
        console.log("Time from DB:", res.rows[0]);
        await client.end();
    } catch (e) {
        console.error("❌ Connection failed:", e);
        process.exit(1);
    }
}

main();
