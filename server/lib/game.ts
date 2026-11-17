import type { SessionData } from "express-session";
import { getCharacterLocation } from "./db.js";

export type GameState = Pick<SessionData, "gameStartedAt" | "gameBoardId" | "gameCompletedMs" | "scoreClaimed">;

export function getCharacterImage(characterName: string): string {
	return `/images/characters/${characterName}.png`;
}

export function startServerTimer(session: GameState, boardId: number): number {
	const startedAt = Date.now();
	session.gameStartedAt = startedAt;
	session.gameBoardId = boardId;
	delete session.gameCompletedMs;
	delete session.scoreClaimed;
	return startedAt;
}

export function getServerElapsedMs(session: GameState, boardId: number): number | null {
	if (session.gameBoardId !== boardId || session.gameStartedAt === undefined) {
		return null;
	}
	if (session.gameCompletedMs !== undefined) {
		return session.gameCompletedMs;
	}
	return Date.now() - session.gameStartedAt;
}

export function completeServerTimer(session: GameState, boardId: number): number | null {
	if (session.gameBoardId !== boardId || session.gameStartedAt === undefined) {
		return null;
	}
	if (session.gameCompletedMs !== undefined) {
		return session.gameCompletedMs;
	}
	const elapsedMs = Date.now() - session.gameStartedAt;
	session.gameCompletedMs = elapsedMs;
	return elapsedMs;
}

/** Hands out the Score of a completed Game exactly once. */
export function claimScore(session: GameState): { boardId: number; elapsedMs: number } | null {
	if (session.gameBoardId === undefined || session.gameCompletedMs === undefined || session.scoreClaimed) {
		return null;
	}
	session.scoreClaimed = true;
	return { boardId: session.gameBoardId, elapsedMs: session.gameCompletedMs };
}

function isPointInRectangle(
	x: number,
	y: number,
	x1: number,
	y1: number,
	x2: number,
	y2: number,
): boolean {
	const minX = Math.min(x1, x2);
	const maxX = Math.max(x1, x2);
	const minY = Math.min(y1, y2);
	const maxY = Math.max(y1, y2);

	return x >= minX && x <= maxX && y >= minY && y <= maxY;
}

export async function checkCharacterAtCoordinates(
	boardName: string,
	characterName: string,
	x: number,
	y: number,
): Promise<boolean> {
	const location = await getCharacterLocation(boardName, characterName);
	if (!location) {
		return false;
	}

	return isPointInRectangle(x, y, location.x1, location.y1, location.x2, location.y2);
}
