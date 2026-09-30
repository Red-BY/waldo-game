import type { Request, Response } from "express";
import { getCharacterNamesForBoard } from "../lib/db.js";

export async function getGameDisplay(req: Request, res: Response) {
	const boardNumber = Number(req.params.boardNumber);

	if (!Number.isInteger(boardNumber) || boardNumber < 1) {
		return res.status(400).json({ error: "Invalid board number" });
	}

	const characterNames = await getCharacterNamesForBoard(boardNumber);
	return res.json(characterNames);
}
