import { PrismaClient } from "@/generated/prisma/client";
import { ensureDatabase } from "./db-init";

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
