import { Router } from "express";
import { getScores, postScore } from "../controllers/scoresController.js";

const scoresRouter: Router = Router();

scoresRouter.get("/", getScores);
scoresRouter.post("/", postScore);

export default scoresRouter;
