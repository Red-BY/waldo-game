import "express-session";

declare module "express-session" {
	interface SessionData {
		gameId?: string;
		gameStartedAt?: number;
		gameBoardId?: number;
		gameCompletedMs?: number;
		foundCharacters?: string[];
	}
}
