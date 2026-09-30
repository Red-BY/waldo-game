import { prisma } from "./prisma";

export async function getAllBoardNames() {
	const boards = await prisma.board.findMany({
		select: { name: true },
		orderBy: { name: "asc" },
	});

	return boards.map((board) => board.name);
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
