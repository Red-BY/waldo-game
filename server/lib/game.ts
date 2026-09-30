import { getCharacterLocation } from "./db.js";

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
