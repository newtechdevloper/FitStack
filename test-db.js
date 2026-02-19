const { Client } = require('pg');
const connectionString = "postgresql://postgres.ntckomiybdxizxpijnmm:Ishan250420%40@aws-0-ap-south-1.pooler.supabase.com:6543/postgres";

console.log("Attempting to connect to:", connectionString.replace(/:[^:@]+@/, ":****@"));

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
