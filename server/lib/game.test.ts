import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { claimScore, completeServerTimer, startServerTimer, type GameState } from "./game.js";

describe("claimScore", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("returns the board and server-measured time of a completed game", () => {
		const session: GameState = {};
		startServerTimer(session, 1);
		vi.advanceTimersByTime(42_500);
		completeServerTimer(session, 1);

		expect(claimScore(session)).toEqual({ boardId: 1, elapsedMs: 42_500 });
	});

	it("allows only one Score per completed game", () => {
		const session: GameState = {};
		startServerTimer(session, 1);
		completeServerTimer(session, 1);
		claimScore(session);

		expect(claimScore(session)).toBeNull();
	});

	it("does not allow claiming a game that was never completed", () => {
		const session: GameState = {};
		expect(claimScore(session)).toBeNull();

		startServerTimer(session, 1);
		vi.advanceTimersByTime(10_000);
		expect(claimScore(session)).toBeNull();
	});

	it("allows a new Score after starting and completing a new game", () => {
		const session: GameState = {};
		startServerTimer(session, 1);
		completeServerTimer(session, 1);
		claimScore(session);

		startServerTimer(session, 1);
		vi.advanceTimersByTime(30_000);
		completeServerTimer(session, 1);

		expect(claimScore(session)).toEqual({ boardId: 1, elapsedMs: 30_000 });
	});
});
