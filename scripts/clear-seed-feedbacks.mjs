import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
const sql = neon(url);

async function clearSeed() {
  const deleted = await sql`
    DELETE FROM customer_feedbacks WHERE ip_hash LIKE 'seed%' RETURNING id, name;
  `;
  console.log('Deleted seed rows:', deleted);
  const remaining = await sql`SELECT id, name, message FROM customer_feedbacks;`;
  console.log('Remaining real feedbacks count:', remaining.length);
}

clearSeed().catch(console.error);
