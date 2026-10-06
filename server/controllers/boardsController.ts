import type { Request, Response } from "express";
import { getAllBoards } from "../lib/db.js";

export async function getBoards(req: Request, res: Response) {
	const boards = await getAllBoards();
	return res.json(boards);
}
