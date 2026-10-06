import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

async function main() {
	const connectionString = process.env.DATABASE_URL;
	if (!connectionString) {
		throw new Error("DATABASE_URL is not set");
	}

	const adapter = new PrismaPg({ connectionString });
	const prisma = new PrismaClient({ adapter });

	try {
		const [characterLocations, boards] = await prisma.$transaction([
			prisma.characterLocation.deleteMany(),
			prisma.board.deleteMany(),
		]);

		console.log(`Deleted ${characterLocations.count} CharacterLocation row(s).`);
		console.log(`Deleted ${boards.count} Board row(s).`);
		console.log("Database cleared.");
	} finally {
		await prisma.$disconnect();
	}
}

main().catch((error: unknown) => {
	console.error(error instanceof Error ? error.message : error);
	process.exit(1);
});
