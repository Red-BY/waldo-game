import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const USAGE = `Usage:
  pnpm delete-score <scoreId>

Removes one Score from its Leaderboard (e.g. an offensive Player Name the filter missed).
Point DATABASE_URL at production to moderate the live Leaderboard.`;

async function main() {
	const args = process.argv.slice(2).filter((arg) => arg !== "--");
	const id = Number(args[0]);
	if (args.length !== 1 || !Number.isInteger(id) || id < 1) {
		throw new Error(USAGE);
	}

	const connectionString = process.env.DATABASE_URL;
	if (!connectionString) {
		throw new Error("DATABASE_URL is not set");
	}

	const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

	try {
		const score = await prisma.score.findUnique({ where: { id } });
		if (!score) {
			throw new Error(`No Score with id ${id}.`);
		}
		await prisma.score.delete({ where: { id } });
		console.log(`Deleted Score ${id}: "${score.playerName}" (${score.score} ms) on Board ${score.boardId}.`);
	} finally {
		await prisma.$disconnect();
	}
}

main().catch((error: unknown) => {
	console.error(error instanceof Error ? error.message : error);
	process.exit(1);
});
