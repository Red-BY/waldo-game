import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

/**
 * Runs a one-off CLI script against DATABASE_URL: connects, runs `task`, always disconnects,
 * and exits non-zero with just the error message on failure.
 */
export function runScript(task: (prisma: PrismaClient) => Promise<void>): void {
	const main = async () => {
		const connectionString = process.env.DATABASE_URL;
		if (!connectionString) {
			throw new Error("DATABASE_URL is not set");
		}

		const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
		try {
			await task(prisma);
		} finally {
			await prisma.$disconnect();
		}
	};

	main().catch((error: unknown) => {
		console.error(error instanceof Error ? error.message : error);
		process.exit(1);
	});
}
