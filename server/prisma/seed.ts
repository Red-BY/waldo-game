import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

/**
 * The Boards and Character Locations that make up the game.
 * Board ids are fixed because the client links to them directly (see client DEFAULT_BOARD_ID).
 * Safe to run on every deploy: Boards are upserted and their Character Locations replaced.
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

async function main() {
	const connectionString = process.env.DATABASE_URL;
	if (!connectionString) {
		throw new Error("DATABASE_URL is not set");
	}

	const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

	try {
		for (const { characterLocations, ...board } of BOARDS) {
			await prisma.$transaction([
				prisma.board.upsert({
					where: { id: board.id },
					create: board,
					update: { name: board.name, image: board.image },
				}),
				prisma.characterLocation.deleteMany({ where: { boardId: board.id } }),
				prisma.characterLocation.createMany({
					data: characterLocations.map((location) => ({ ...location, boardId: board.id })),
				}),
			]);
			console.log(`Seeded Board "${board.name}" with ${characterLocations.length} Character Location(s).`);
		}

		// Explicit ids don't advance the sequence; move it past them so add-board keeps working.
		await prisma.$executeRawUnsafe(
			`SELECT setval(pg_get_serial_sequence('"Board"', 'id'), GREATEST((SELECT MAX("id") FROM "Board"), 1))`,
		);
	} finally {
		await prisma.$disconnect();
	}
}

main().catch((error: unknown) => {
	console.error(error instanceof Error ? error.message : error);
	process.exit(1);
});
