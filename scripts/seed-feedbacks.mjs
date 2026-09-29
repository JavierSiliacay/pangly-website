import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL is missing');
  process.exit(1);
}

const sql = neon(url);

async function seed() {
  const existing = await sql.query('SELECT count(*) FROM customer_feedbacks;');
  const total = Number(existing[0]?.count ?? 0);

  if (total > 0) {
    console.log(`Table already has ${total} feedbacks. Skipping seed.`);
    return;
  }

  console.log('Seeding initial community feedbacks...');
  await sql`
    INSERT INTO customer_feedbacks (category, rating, message, name, ip_hash) VALUES
    ('feature_request', 5, 'Please support Senior Citizen booklet & medicine 20% discount tracking for my lola. It is so hard to calculate at Mercury Drug every week!', 'Kuya Mark • Cebu', 'seed-hash-1'),
    ('review', 5, 'Finally an app that does not upload my PhilID, Driver License, and SSS number to foreign cloud servers! The OCR is super fast even completely offline.', 'Elena R. • Quezon City', 'seed-hash-2'),
    ('feature_request', 5, 'LTO OR/CR vehicle registration renewal reminder alert 1 month before expiration date based on plate ending number.', 'Paolo V. • Davao', 'seed-hash-3'),
    ('bug_report', 4, 'Camera OCR preview on dark wooden tables took a few seconds to detect national ID edges on my Redmi Note 11. Works great under bright light though.', 'Dave • Pasig', 'seed-hash-4');
  `;
  console.log('✅ Successfully seeded authentic feedbacks!');
}

seed().catch((err) => {
  console.error('Error seeding feedbacks:', err);
  process.exit(1);
});
