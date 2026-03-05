import fs from "fs";
import path from "path";

const PROD_DB_PATH = "/tmp/bloom.db";

let initialized = false;

/**
 * Find the seeded bloom.db file. In Vercel serverless, the cwd and
 * file locations differ from local dev.
 */
function findSourceDb(): string | null {
  const candidates = [
    path.join(process.cwd(), "prisma", "bloom.db"),
    path.join(__dirname, "..", "..", "prisma", "bloom.db"),
    path.join(__dirname, "..", "..", "..", "prisma", "bloom.db"),
    path.join(__dirname, "..", "..", "..", "..", "prisma", "bloom.db"),
    "/var/task/prisma/bloom.db",
    "/var/task/.next/server/prisma/bloom.db",
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

  // Log what we can see for debugging
  console.error("[db-init] Could not find bloom.db");
  console.error("[db-init] cwd:", process.cwd());
  console.error("[db-init] __dirname:", __dirname);
  try {
    const cwdFiles = fs.readdirSync(process.cwd());
    console.error("[db-init] cwd contents:", cwdFiles.join(", "));
    if (cwdFiles.includes("prisma")) {
      const prismaFiles = fs.readdirSync(path.join(process.cwd(), "prisma"));
      console.error("[db-init] prisma/ contents:", prismaFiles.join(", "));
    }
  } catch (e) {
    console.error("[db-init] Error listing cwd:", e);
  }

  return null;
}

/**
 * On Vercel serverless, SQLite files can't persist in the function's read-only FS.
 * We bundle a pre-seeded DB and copy it to /tmp on cold start.
 */
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
