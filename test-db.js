const { Client } = require('pg');

async function test() {
    const connectionString = "postgresql://postgres:Ishan250420%40@db.ntckomiybdxizxpijnmm.supabase.co:6543/postgres";
    const client = new Client({ connectionString });
    try {
        console.log("Connecting to alternative pooler URL (6543 with project hostname)...");
        await client.connect();
        console.log("Connected!");
        const res = await client.query('SELECT NOW()');
        console.log("Result:", res.rows[0]);
        await client.end();
    } catch (err) {
        console.error("Connection failed:", err.message);
    }
}

test();
