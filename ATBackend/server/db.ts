// import { Pool, neonConfig } from '@neondatabase/serverless';
// import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import pkg from "pg";
import { drizzle } from "drizzle-orm/node-postgres"; // <-- normal node-postgres adapter
import * as schema from "../shared/schema";
import dotenv from "dotenv";
import path from "path";
const { Pool } = pkg;

dotenv.config({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || "development"}`)
})
// neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ 
  connectionString: "postgresql://ansari:6298@localhost:5432/astrotickdb",
  max: 50,        // Optimized max connections for production load
  min: 10,        // Minimum pool size for better availability
  idleTimeoutMillis: 30000,  // Close idle connections after 30s
  connectionTimeoutMillis: 15000, // Extended timeout for getting connection
});
console.log(pool)
export const db = drizzle({ client: pool, schema });