import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const USAGE = `Usage:
  pnpm add-character-location <boardName> <characterName> <x1> <y1> <x2> <y2>

Example:
  pnpm add-character-location Game1 Waldo 120.5 340 145 380

The board must already exist (create one with pnpm add-board).`;

function parseArgs(argv: string[]) {
	if (argv.length !== 6) {
		throw new Error(`Expected 6 arguments, got ${argv.length}.\n\n${USAGE}`);
	}

	const [boardName, characterName, x1Raw, y1Raw, x2Raw, y2Raw] = argv;
	const coords = [x1Raw, y1Raw, x2Raw, y2Raw].map((value, index) => {
		const parsed = Number(value);
		if (!Number.isFinite(parsed)) {
			throw new Error(`Coordinate #${index + 1} must be a number, got "${value}".\n\n${USAGE}`);
		}
		return parsed;
	});

	return {
		boardName: boardName!,
		characterName: characterName!,
		x1: coords[0]!,
		y1: coords[1]!,
		x2: coords[2]!,
		y2: coords[3]!,
	};
}

async function main() {
	const { boardName, characterName, x1, y1, x2, y2 } = parseArgs(process.argv.slice(2));

	const connectionString = process.env.DATABASE_URL;
	if (!connectionString) {
		throw new Error("DATABASE_URL is not set");
	}

	const adapter = new PrismaPg({ connectionString });
	const prisma = new PrismaClient({ adapter });

	try {
		const board = await prisma.board.findUnique({ where: { name: boardName } });
		if (!board) {
			throw new Error(`Board "${boardName}" not found. Create it first with: pnpm add-board ${boardName}`);
		}

		const entry = await prisma.characterLocation.create({
			data: {
				boardId: board.id,
				characterName,
				x1,
				y1,
				x2,
				y2,
			},
		});
		console.log("Created CharacterLocation:");
		console.log(entry);
	} finally {
		await prisma.$disconnect();
	}
}

main().catch((error: unknown) => {
	console.error(error instanceof Error ? error.message : error);
	process.exit(1);
});
