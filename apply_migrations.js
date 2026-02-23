const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function run() {
    const client = new Client({
        user: 'postgres',
        password: 'Tolu&gujja@5',
        host: 'db.hlvwfzickwpobjaxsbcc.supabase.co',
        port: 5432,
        database: 'postgres',
        ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    console.log('Connected to remote DB');

    const migrationsDir = path.join(__dirname, 'supabase', 'migrations');
    const files = fs.readdirSync(migrationsDir).sort();

    // Find index of the purge
    const purgeIndex = files.findIndex(f => f === '20260224_the_great_purge.sql');
    if (purgeIndex === -1) {
        console.error('Purge file not found');
        process.exit(1);
    }

    const pendingFiles = files.slice(purgeIndex);

    for (const file of pendingFiles) {
        console.log(`Executing ${file}...`);
        try {
            const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
            await client.query(sql);
            console.log(`Success: ${file}`);
        } catch (e) {
            console.error(`Error in ${file}:`, e.message);
            // Let's decide if we want to break or continue.
            // E.g., if a table already dropped, it might throw, but often migrations are idempotent if written well.
            // But we will continue for now.
        }
    }

    // count tables
    const res = await client.query(`
    SELECT count(*) FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
  `);
    console.log(`Total public tables remaining: ${res.rows[0].count}`);

    await client.end();
}

run().catch(console.error);
