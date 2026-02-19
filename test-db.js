const { Client } = require('pg');
const connectionString = "postgresql://postgres:Ishan250420%40@db.ntckomiybdxizxpijnmm.supabase.co:5432/postgres";

console.log("Attempting standard direct connection to:", connectionString.replace(/:[^:@]+@/, ":****@"));

const client = new Client({
    connectionString: connectionString,
});

client.connect()
    .then(() => {
        console.log('✅ Success: Connected to Supabase!');
        client.end();
    })
    .catch(err => {
        console.error('❌ Connection error:', err.message);
        process.exit(1);
    });
