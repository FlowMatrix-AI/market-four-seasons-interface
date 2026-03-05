import fs from "fs";
import path from "path";

const PROD_DB_PATH = "/tmp/bloom.db";

let initialized = false;

// Set Prisma engine path for Vercel serverless (must happen before PrismaClient instantiation)
if (process.env.NODE_ENV === "production" && !process.env.PRISMA_QUERY_ENGINE_LIBRARY) {
  try {
    const enginePath = path.join(
      process.cwd(),
      "src",
      "generated",
      "prisma",
      "libquery_engine-rhel-openssl-3.0.x.so.node"
    );
    if (fs.existsSync(enginePath)) {
      process.env.PRISMA_QUERY_ENGINE_LIBRARY = enginePath;
      console.log("[db-init] Set PRISMA_QUERY_ENGINE_LIBRARY to", enginePath);
    }
  } catch {
    // ignore
  }
}

function findSourceDb(): string | null {
  const candidates = [
    path.join(process.cwd(), "prisma", "bloom.db"),
    path.join(__dirname, "..", "..", "prisma", "bloom.db"),
    path.join(__dirname, "..", "..", "..", "prisma", "bloom.db"),
    path.join(__dirname, "..", "..", "..", "..", "prisma", "bloom.db"),
    "/var/task/prisma/bloom.db",
  ];

  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    } catch {
      // ignore access errors
    }
  }

  console.error("[db-init] Could not find bloom.db");
  console.error("[db-init] cwd:", process.cwd());
  return null;
}

export function ensureDatabase(): string {
  if (process.env.NODE_ENV !== "production") {
    return "file:./prisma/dev.db";
  }

  if (initialized && fs.existsSync(PROD_DB_PATH)) {
    return `file:${PROD_DB_PATH}`;
  }

  const source = findSourceDb();
  if (source) {
    fs.copyFileSync(source, PROD_DB_PATH);
    console.log("[db-init] Copied seeded DB from", source, "to", PROD_DB_PATH);
  } else {
    console.error("[db-init] WARNING: No source DB found. Login will not work.");
  }

  initialized = true;
  return `file:${PROD_DB_PATH}`;
}
