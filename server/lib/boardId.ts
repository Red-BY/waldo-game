/** Parses a Board id from a route param or query string; null when it isn't a positive integer. */
export function parseBoardId(value: unknown): number | null {
	const boardId = Number(value);
	return Number.isInteger(boardId) && boardId >= 1 ? boardId : null;
}
