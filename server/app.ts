// Locally settings come from .env (if present); on Render they are real environment variables.
import "dotenv/config";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { createSessionMiddleware } from "./lib/session.js";
import boardsRouter from "./routes/boardsRouter.js";
import gameRouter from "./routes/gameRouter.js";
import scoresRouter from "./routes/scoresRouter.js";

const isProduction = process.env.NODE_ENV === "production";

const app = express();

// Render terminates TLS at its proxy; trust it so secure cookies are issued.
app.set("trust proxy", 1);

app.use(createSessionMiddleware({ isProduction }));
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
	app.get(/^(?!\/(api|images)(\/|$)).*/, (_req, res) => {
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
