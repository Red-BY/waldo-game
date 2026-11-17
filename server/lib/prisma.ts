import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import { pool } from "./pool.js";

const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

export { prisma };
