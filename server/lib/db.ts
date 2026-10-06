import { prisma } from "./prisma";

export async function getAllBoards() {
	return prisma.board.findMany({
		select: { id: true, name: true },
		orderBy: { name: "asc" },
	});
}

export async function getCharactersForBoard(boardName: string) {
	return prisma.characterLocation.findMany({
		where: { board: { name: boardName } },
		select: {
			characterName: true,
			x1: true,
			y1: true,
			x2: true,
			y2: true,
		},
		orderBy: { characterName: "asc" },
	});
}

export async function getBoardById(boardId: number) {
	return prisma.board.findUnique({
		where: { id: boardId },
		select: { id: true, name: true, image: true },
	});
}

export async function getCharacterNamesForBoard(boardId: number) {
	const characters = await prisma.characterLocation.findMany({
		where: { boardId },
		select: { characterName: true },
		orderBy: { characterName: "asc" },
		take: 3,
	});

	return characters.map((character) => character.characterName);
}

export async function getCharacterLocation(boardName: string, characterName: string) {
	return prisma.characterLocation.findFirst({
		where: {
			characterName,
			board: { name: boardName },
		},
		select: {
			characterName: true,
			x1: true,
			y1: true,
			x2: true,
			y2: true,
		},
	});
}
