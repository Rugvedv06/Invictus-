import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function run() {
    try {
        console.log('--- INSPECTING TRIGGERS ---');

        const triggers = await pool.query(`
            SELECT 
                event_object_table AS "table",
                trigger_name,
                event_manipulation AS "event",
                action_orientation AS "orientation",
                action_timing AS "timing"
            FROM information_schema.triggers
            WHERE trigger_schema = 'public'
            ORDER BY event_object_table, trigger_name
        `);
        console.log(JSON.stringify(triggers.rows, null, 2));

        console.log('--- INSPECTING FUNCTIONS ---');
        const funcs = await pool.query(`
            SELECT p.proname AS "function_name", pg_get_functiondef(p.oid) AS "definition"
            FROM pg_proc p
            JOIN pg_namespace n ON p.pronamespace = n.oid
            WHERE n.nspname = 'public'
        `);

        for (const func of funcs.rows) {
            console.log(`FUNCTION: ${func.function_name}`);
            console.log(func.definition);
            console.log('-----------------------------------');
        }

    } catch (e) {
        console.error(e);
    } finally {
        await pool.end();
    }
}
run();
