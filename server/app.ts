import express from "express";
import path from "node:path";
import { loadEnvFile } from "node:process";
import session from "express-session";
import passport from "passport";
import boardsRouter from "./routes/boardsRouter.js";
import gameRouter from "./routes/gameRouter.js";
import scoresRouter from "./routes/scoresRouter.js";

const app = express();

loadEnvFile();

app.set("views", path.join(import.meta.dirname, "views"));
app.set("view engine", "ejs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/images", express.static(path.join(import.meta.dirname, "images")));

app.use("/api/boards", boardsRouter);
app.use("/api/game", gameRouter);
app.use("/api/scores", scoresRouter);

const PORT = process.env.PORT || 8080;

app.listen(PORT, (error?: Error) => {
    if (error) {
        throw error;
    }
    console.log(`Express app listening on port ${PORT}!`);
});
