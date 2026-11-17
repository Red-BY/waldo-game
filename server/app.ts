import express from "express";
import fs from "node:fs";
import path from "node:path";
import { loadEnvFile } from "node:process";
import connectPgSimple from "connect-pg-simple";
import session from "express-session";
import pg from "pg";
import boardsRouter from "./routes/boardsRouter.js";
import gameRouter from "./routes/gameRouter.js";
import scoresRouter from "./routes/scoresRouter.js";

// Locally settings come from .env; on Render they are real environment variables.
if (fs.existsSync(path.join(import.meta.dirname, ".env"))) {
	loadEnvFile(path.join(import.meta.dirname, ".env"));
}

const isProduction = process.env.NODE_ENV === "production";

const sessionSecret = process.env.SESSION_SECRET;
if (isProduction && !sessionSecret) {
	throw new Error("SESSION_SECRET must be set in production");
}

const app = express();

// Render terminates TLS at its proxy; trust it so secure cookies are issued.
app.set("trust proxy", 1);

const PgSessionStore = connectPgSimple(session);
const sessionPool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

app.use(
	session({
		store: new PgSessionStore({ pool: sessionPool, tableName: "session" }),
		secret: sessionSecret ?? "dev-only-session-secret",
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 24 * 60 * 60 * 1000,
			httpOnly: true,
			sameSite: "lax",
			secure: isProduction,
		},
	}),
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/images", express.static(path.join(import.meta.dirname, "images")));

app.use("/api/boards", boardsRouter);
app.use("/api/game", gameRouter);
app.use("/api/scores", scoresRouter);

// Serve the built React app; any non-API route falls through to index.html for client-side routing.
const clientDist = path.join(import.meta.dirname, "..", "client", "dist");
if (fs.existsSync(clientDist)) {
	app.use(express.static(clientDist));
	app.get(/^(?!\/(api|images)\/).*/, (_req, res) => {
		res.sendFile(path.join(clientDist, "index.html"));
	});
}

const PORT = process.env.PORT || 8080;

app.listen(PORT, (error?: Error) => {
	if (error) {
		throw error;
	}
	console.log(`Express app listening on port ${PORT}!`);
});
