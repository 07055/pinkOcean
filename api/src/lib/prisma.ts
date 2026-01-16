// If your file is in api/src/lib/prisma.ts
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

// 1. Create the pool using your .env string
const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });

// 2. Setup the Prisma 7 Adapter
const adapter = new PrismaPg(pool);

// 3. Prevent multiple instances in development (Singleton)
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = 
  globalForPrisma.prisma || 
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;