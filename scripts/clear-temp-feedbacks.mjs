import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL is missing in .env.local');
  process.exit(1);
}

const sql = neon(url);

async function clearTempFeedbacks() {
  console.log('Deleting temporary seeded feedbacks (ip_hash = temp_seed_30)...');
  const deleted = await sql`
    DELETE FROM customer_feedbacks 
    WHERE ip_hash = 'temp_seed_30' 
    RETURNING id, name;
  `;
  console.log(`✅ Deleted ${deleted.length} temporary feedbacks.`);

  const remaining = await sql`SELECT COUNT(*) as total FROM customer_feedbacks;`;
  console.log(`Remaining real user feedbacks in DB: ${remaining[0].total}`);
}

clearTempFeedbacks().catch(console.error);
