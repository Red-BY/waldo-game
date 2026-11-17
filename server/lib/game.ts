import { randomUUID } from "node:crypto";
import type { SessionData } from "express-session";
import { getCharacterLocation } from "./db.js";

export type GameState = Pick<
	SessionData,
	"gameId" | "gameStartedAt" | "gameBoardId" | "gameCompletedMs" | "foundCharacters"
>;

/** A finished Game whose time can become a Score. gameId lets the database record at most one Score per Game. */
export type CompletedGame = { gameId: string; boardId: number; elapsedMs: number };

export function getCharacterImage(characterName: string): string {
	return `/images/characters/${characterName}.png`;
}

export function startServerTimer(session: GameState, boardId: number): number {
	const startedAt = Date.now();
	session.gameId = randomUUID();
	session.gameStartedAt = startedAt;
	session.gameBoardId = boardId;
	session.foundCharacters = [];
	delete session.gameCompletedMs;
	return startedAt;
}

function isActiveGame(session: GameState, boardId: number): boolean {
	return session.gameBoardId === boardId && session.gameStartedAt !== undefined;
}

/** Remembers that a character was found in the active, unfinished Game on this Board. */
export function recordFoundCharacter(session: GameState, boardId: number, characterName: string): void {
	if (!isActiveGame(session, boardId) || session.gameCompletedMs !== undefined) {
		return;
	}
	const found = session.foundCharacters ?? [];
	if (!found.includes(characterName)) {
		session.foundCharacters = [...found, characterName];
	}
}

export function getServerElapsedMs(session: GameState, boardId: number): number | null {
	if (!isActiveGame(session, boardId)) {
		return null;
	}
	if (session.gameCompletedMs !== undefined) {
		return session.gameCompletedMs;
	}
	return Date.now() - session.gameStartedAt!;
}

/** Stops the clock, but only once every required character has been found. */
export function completeServerTimer(
	session: GameState,
	boardId: number,
	requiredCharacters: string[],
): number | null {
	if (!isActiveGame(session, boardId)) {
		return null;
	}
	if (session.gameCompletedMs !== undefined) {
		return session.gameCompletedMs;
	}
	const found = session.foundCharacters ?? [];
	if (requiredCharacters.length === 0 || !requiredCharacters.every((name) => found.includes(name))) {
		return null;
	}
	const elapsedMs = Date.now() - session.gameStartedAt!;
	session.gameCompletedMs = elapsedMs;
	return elapsedMs;
}

export function getCompletedGame(session: GameState): CompletedGame | null {
	if (session.gameId === undefined || session.gameBoardId === undefined || session.gameCompletedMs === undefined) {
		return null;
	}
	return { gameId: session.gameId, boardId: session.gameBoardId, elapsedMs: session.gameCompletedMs };
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
