import "express-session";

declare module "express-session" {
	interface SessionData {
		gameStartedAt?: number;
		gameBoardId?: number;
		gameCompletedMs?: number;
	}
}
