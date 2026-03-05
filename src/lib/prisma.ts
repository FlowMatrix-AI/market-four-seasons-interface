// IMPORTANT: db-init must be imported first - it sets PRISMA_QUERY_ENGINE_LIBRARY
import { ensureDatabase } from "./db-init";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const url = ensureDatabase();
  return new PrismaClient({
    datasources: {
      db: { url },
    },
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
