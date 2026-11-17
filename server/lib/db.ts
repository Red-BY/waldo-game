import type { CompletedGame } from "./game.js";
import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "./prisma.js";

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

/** Records a completed Game as a Score; returns null if that Game already has a Score. */
export async function createScore({ gameId, boardId, elapsedMs }: CompletedGame, playerName: string) {
	try {
		return await prisma.score.create({
			data: { gameId, boardId, playerName, score: elapsedMs },
			select: { id: true, playerName: true, score: true },
		});
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
			return null;
		}
		throw error;
	}
}

export async function getScoresForBoard(boardId: number) {
	return prisma.score.findMany({
		where: { boardId },
		select: { id: true, playerName: true, score: true },
		orderBy: [{ score: "asc" }, { id: "asc" }],
	});
}
