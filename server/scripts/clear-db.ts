import { runScript } from "../lib/runScript.js";

runScript(async (prisma) => {
	const [characterLocations, boards] = await prisma.$transaction([
		prisma.characterLocation.deleteMany(),
		prisma.board.deleteMany(),
	]);

	console.log(`Deleted ${characterLocations.count} CharacterLocation row(s).`);
	console.log(`Deleted ${boards.count} Board row(s).`);
	console.log("Database cleared.");
});
