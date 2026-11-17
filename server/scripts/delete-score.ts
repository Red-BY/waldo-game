import { runScript } from "../lib/runScript.js";

const USAGE = `Usage:
  pnpm delete-score <scoreId>

Removes one Score from its Leaderboard (e.g. an offensive Player Name the filter missed).
Point DATABASE_URL at production to moderate the live Leaderboard.`;

runScript(async (prisma) => {
	const args = process.argv.slice(2).filter((arg) => arg !== "--");
	const id = Number(args[0]);
	if (args.length !== 1 || !Number.isInteger(id) || id < 1) {
		throw new Error(USAGE);
	}

	const score = await prisma.score.findUnique({ where: { id } });
	if (!score) {
		throw new Error(`No Score with id ${id}.`);
	}
	await prisma.score.delete({ where: { id } });
	console.log(`Deleted Score ${id}: "${score.playerName}" (${score.score} ms) on Board ${score.boardId}.`);
});
