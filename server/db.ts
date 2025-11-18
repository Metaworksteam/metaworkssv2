
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.warn("Database URL not found. Running in limited mode.");
}

// Use connection pooling with fallback
export const pool = DATABASE_URL ? new Pool({ 
  connectionString: DATABASE_URL,
  max: 10,
  connectionTimeoutMillis: 5000
}) : null;

if (pool) {
  pool.on('error', (err) => {
    console.error('Unexpected error on idle database client', err);
  });
}

export const db = pool ? drizzle({ client: pool, schema }) : null;
