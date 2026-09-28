import type { Request, Response } from "express";
import { getAllBoardNames } from "../lib/db.js";

export async function getBoardNames(req: Request, res: Response) {
	const boardNames = await getAllBoardNames();
	return res.json(boardNames);
}
