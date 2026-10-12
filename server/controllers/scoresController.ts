import type { Request, Response } from "express";
import { createScore, getAllScores } from "../lib/db.js";

export async function getScores(req: Request, res: Response) {
	const scores = await getAllScores();
	return res.json(scores);
}

export async function postScore(req: Request, res: Response) {
	const { name, score } = req.body;

	if (typeof name !== "string" || !name.trim()) {
		return res.status(400).json({ error: "Invalid name" });
	}

	if (typeof score !== "number" || !Number.isInteger(score) || score < 0) {
		return res.status(400).json({ error: "Invalid score" });
	}

	const created = await createScore(name.trim(), score);
	return res.status(201).json(created);
}
