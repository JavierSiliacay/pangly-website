import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

if (!url) {
  console.error('❌ Error: DATABASE_URL is missing from .env.local');
  process.exit(1);
}

const sql = neon(url);

async function reset() {
  console.log('🔄 Resetting early_access_slots table in Neon DB...');
  await sql.query('TRUNCATE TABLE early_access_slots RESTART IDENTITY;');
  console.log('✅ Slot counter successfully reset to 0 (0 / 100 claimed)!');
}

reset().catch((err) => {
  console.error('❌ Failed to reset slots:', err);
  process.exit(1);
});
