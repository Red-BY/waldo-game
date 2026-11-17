import type { Request, Response } from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { parseBoardId } from "../lib/boardId.js";
import { getBoardById, getCharacterNamesForBoard } from "../lib/db.js";
import {
	checkCharacterAtCoordinates,
	completeServerTimer,
	recordFoundCharacter,
	startServerTimer,
} from "../lib/game.js";

export async function getGameDisplay(req: Request, res: Response) {
	const boardNumber = parseBoardId(req.params.boardNumber);
	if (boardNumber === null) {
		return res.status(400).json({ error: "Invalid board number" });
	}

	const board = await getBoardById(boardNumber);
	if (!board) {
		return res.status(404).json({ error: "Board not found" });
	}

	const imagePath = path.join(import.meta.dirname, "..", "images", board.image);
	try {
		await fs.access(imagePath);
	} catch {
		return res.status(404).json({ error: "Board image not found" });
	}

	const characterNames = await getCharacterNamesForBoard(boardNumber);
	startServerTimer(req.session, boardNumber);

	return res.json({
		characters: characterNames,
		image: `/images/${board.image}`,
	});
}

export async function checkCharacter(req: Request, res: Response) {
	const boardNumber = parseBoardId(req.params.boardNumber);
	const { characterName, x, y } = req.body;

	if (boardNumber === null) {
		return res.status(400).json({ error: "Invalid board number" });
	}

	if (typeof characterName !== "string" || !characterName.trim()) {
		return res.status(400).json({ error: "Invalid character name" });
	}

	if (typeof x !== "number" || typeof y !== "number" || !Number.isFinite(x) || !Number.isFinite(y)) {
		return res.status(400).json({ error: "Invalid coordinates" });
	}

	const board = await getBoardById(boardNumber);
	if (!board) {
		return res.status(404).json({ error: "Board not found" });
	}

	const found = await checkCharacterAtCoordinates(board.name, characterName, x, y);
	if (found) {
		recordFoundCharacter(req.session, boardNumber, characterName);
	}
	return res.json({ found });
}

export async function completeGame(req: Request, res: Response) {
	const boardNumber = parseBoardId(req.params.boardNumber);
	if (boardNumber === null) {
		return res.status(400).json({ error: "Invalid board number" });
	}

	const board = await getBoardById(boardNumber);
	if (!board) {
		return res.status(404).json({ error: "Board not found" });
	}

	const requiredCharacters = await getCharacterNamesForBoard(boardNumber);
	const elapsedMs = completeServerTimer(req.session, boardNumber, requiredCharacters);
	if (elapsedMs === null) {
		return res.status(400).json({ error: "No finished game for this board" });
	}

	return res.json({ elapsedMs });
}
