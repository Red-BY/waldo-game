import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	completeServerTimer,
	getCompletedGame,
	recordFoundCharacter,
	startServerTimer,
	type GameState,
} from "./game.js";

const CHARACTERS = ["Odlaw", "Waldo", "Wizard"];

function findAll(session: GameState, boardId: number) {
	for (const name of CHARACTERS) {
		recordFoundCharacter(session, boardId, name);
	}
}

describe("Game completion and Score", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("gives the board and server-measured time of a game where every character was found", () => {
		const session: GameState = {};
		startServerTimer(session, 1);
		vi.advanceTimersByTime(42_500);
		findAll(session, 1);
		completeServerTimer(session, 1, CHARACTERS);

		expect(getCompletedGame(session)).toMatchObject({ boardId: 1, elapsedMs: 42_500 });
	});

	it("refuses to complete a game until every character has been found", () => {
		const session: GameState = {};
		startServerTimer(session, 1);
		recordFoundCharacter(session, 1, "Waldo");

		expect(completeServerTimer(session, 1, CHARACTERS)).toBeNull();
		expect(getCompletedGame(session)).toBeNull();
	});

	it("ignores characters found on a different board than the active game", () => {
		const session: GameState = {};
		startServerTimer(session, 1);
		findAll(session, 2);

		expect(completeServerTimer(session, 1, CHARACTERS)).toBeNull();
	});

	it("forgets found characters when a new game starts", () => {
		const session: GameState = {};
		startServerTimer(session, 1);
		findAll(session, 1);
		startServerTimer(session, 1);

		expect(completeServerTimer(session, 1, CHARACTERS)).toBeNull();
	});

	it("does not give a Score for a game that was never completed", () => {
		const session: GameState = {};
		expect(getCompletedGame(session)).toBeNull();

		startServerTimer(session, 1);
		findAll(session, 1);
		expect(getCompletedGame(session)).toBeNull();
	});

	it("identifies each game uniquely so a Score can be recorded once per game", () => {
		const session: GameState = {};
		startServerTimer(session, 1);
		findAll(session, 1);
		completeServerTimer(session, 1, CHARACTERS);
		const first = getCompletedGame(session);

		expect(getCompletedGame(session)?.gameId).toBe(first?.gameId);

		startServerTimer(session, 1);
		vi.advanceTimersByTime(30_000);
		findAll(session, 1);
		completeServerTimer(session, 1, CHARACTERS);
		const second = getCompletedGame(session);

		expect(second).toMatchObject({ boardId: 1, elapsedMs: 30_000 });
		expect(second?.gameId).not.toBe(first?.gameId);
	});
});
