import type { Request, Response } from "express";
import { parseBoardId } from "../lib/boardId.js";
import { createScore, getScoresForBoard } from "../lib/db.js";
import { getCompletedGame } from "../lib/game.js";
import { validatePlayerName } from "../lib/playerName.js";

export async function getScores(req: Request, res: Response) {
	const boardId = parseBoardId(req.query.boardId);
	if (boardId === null) {
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
	const game = getCompletedGame(req.session);
	if (!game) {
		return res.status(409).json({ error: "No completed game to record" });
	}

	const created = await createScore(game, playerName.name);
	if (!created) {
		return res.status(409).json({ error: "This game's Score has already been recorded" });
	}
	return res.status(201).json(created);
}
