import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const USAGE = `Usage:
  pnpm add-board <boardName> <image>

Example:
  pnpm add-board Game1 Game1.jpg`;

function parseArgs(argv: string[]) {
	if (argv.length !== 2) {
		throw new Error(`Expected 2 arguments, got ${argv.length}.\n\n${USAGE}`);
	}

	const [boardName, image] = argv;
	if (!boardName!.trim()) {
		throw new Error(`Board name must not be empty.\n\n${USAGE}`);
	}
	if (!image!.trim()) {
		throw new Error(`Image must not be empty.\n\n${USAGE}`);
	}

	return { name: boardName!, image: image! };
}

async function main() {
	const data = parseArgs(process.argv.slice(2));

	const connectionString = process.env.DATABASE_URL;
	if (!connectionString) {
		throw new Error("DATABASE_URL is not set");
	}

	const adapter = new PrismaPg({ connectionString });
	const prisma = new PrismaClient({ adapter });

	try {
		const board = await prisma.board.create({ data });
		console.log("Created Board:");
		console.log(board);
	} finally {
		await prisma.$disconnect();
	}
}

main().catch((error: unknown) => {
	console.error(error instanceof Error ? error.message : error);
	process.exit(1);
});
