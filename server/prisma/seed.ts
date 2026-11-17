import { runScript } from "../lib/runScript.js";

/**
 * The Boards and Character Locations that make up the game.
 * New Boards are created with these fixed ids because the client links to them directly (see client DEFAULT_BOARD_ID).
 * Safe to run on every deploy: Boards are upserted by name and their Character Locations replaced.
 */
const BOARDS = [
	{
		id: 2,
		name: "Space",
		image: "Game1.jpg",
		characterLocations: [
			{ characterName: "Odlaw", x1: 163, y1: 1143, x2: 198, y2: 1191 },
			{ characterName: "Waldo", x1: 1020, y1: 1031, x2: 1055, y2: 1093 },
			{ characterName: "Wizard", x1: 1983, y1: 947, x2: 2017, y2: 1023 },
		],
	},
];

runScript(async (prisma) => {
	for (const { characterLocations, ...board } of BOARDS) {
		const seeded = await prisma.$transaction(async (tx) => {
			// Matched by its unique name, so an existing Board is updated in place whatever its id.
			const { id } = await tx.board.upsert({
				where: { name: board.name },
				create: board,
				update: { image: board.image },
			});
			await tx.characterLocation.deleteMany({ where: { boardId: id } });
			await tx.characterLocation.createMany({
				data: characterLocations.map((location) => ({ ...location, boardId: id })),
			});
			return id;
		});
		if (seeded !== board.id) {
			console.warn(`Board "${board.name}" has id ${seeded}, not ${board.id}; the client links to ${board.id}.`);
		}
		console.log(`Seeded Board "${board.name}" with ${characterLocations.length} Character Location(s).`);
	}

	// Explicit ids don't advance the sequence; move it past them so add-board keeps working.
	await prisma.$executeRawUnsafe(
		`SELECT setval(pg_get_serial_sequence('"Board"', 'id'), GREATEST((SELECT MAX("id") FROM "Board"), 1))`,
	);
});
