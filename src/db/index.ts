import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL_UNPOOLED ||
  '';

if (!connectionString) {
  console.warn(
    '⚠️ [Neon DB] DATABASE_URL is not set. If you recently edited .env.local, please restart "pnpm dev" to pick up new environment variables.'
  );
}

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
