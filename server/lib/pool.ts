import "dotenv/config";
import pg from "pg";

/** The app's single Postgres connection pool, shared by Prisma and the session store. */
export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
