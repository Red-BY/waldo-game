import connectPgSimple from "connect-pg-simple";
import type { RequestHandler } from "express";
import session from "express-session";
import { pool } from "./pool.js";

const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;

/** Sessions hold the player's current Game; stored in Postgres so restarts and free-tier sleeps don't lose them. */
export function createSessionMiddleware({ isProduction }: { isProduction: boolean }): RequestHandler {
	const secret = process.env.SESSION_SECRET;
	if (isProduction && !secret) {
		throw new Error("SESSION_SECRET must be set in production");
	}

	const PgSessionStore = connectPgSimple(session);

	return session({
		store: new PgSessionStore({ pool, tableName: "session" }),
		secret: secret ?? "dev-only-session-secret",
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: SESSION_MAX_AGE_MS,
			httpOnly: true,
			sameSite: "lax",
			secure: isProduction,
		},
	});
}
