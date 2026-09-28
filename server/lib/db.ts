import { prisma } from "./prisma";

export async function getAllBoardNames() {
	const boards = await prisma.characterLocation.findMany({
		distinct: ["boardName"],
		select: { boardName: true },
		orderBy: { boardName: "asc" },
	});

	return boards.map((board) => board.boardName);
}

export async function getCharactersForBoard(boardName: string) {
	return prisma.characterLocation.findMany({
		where: { boardName },
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
