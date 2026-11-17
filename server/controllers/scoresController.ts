import type { Request, Response } from "express";
import { createScore, getScoresForBoard } from "../lib/db.js";
import { claimScore } from "../lib/game.js";
import { validatePlayerName } from "../lib/playerName.js";

export async function getScores(req: Request, res: Response) {
	const boardId = Number(req.query.boardId);
	if (!Number.isInteger(boardId) || boardId < 1) {
		return res.status(400).json({ error: "Invalid board id" });
	}

	const scores = await getScoresForBoard(boardId);
	return res.json(scores);
}

export async function postScore(req: Request, res: Response) {
	const playerName = validatePlayerName(req.body?.name);
	if (!playerName.ok) {
		return res.status(400).json({ error: playerName.error });
	}

	// The Score is the server-measured time of the session's completed Game; the client never sends it.
	const claimed = claimScore(req.session);
	if (!claimed) {
		return res.status(409).json({ error: "No completed game to record" });
	}

	try {
		const created = await createScore(claimed.boardId, playerName.name, claimed.elapsedMs);
		return res.status(201).json(created);
	} catch (error) {
		// Let the player retry rather than losing their Score to a transient database error.
		delete req.session.scoreClaimed;
		throw error;
	}
}
