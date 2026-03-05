import fs from "fs";
import path from "path";

const PROD_DB_PATH = "/tmp/bloom.db";
const SOURCE_DB_PATH = path.join(process.cwd(), "prisma", "bloom.db");

let initialized = false;

/**
 * On Vercel serverless, SQLite files can't persist in the function's read-only FS.
 * We bundle a pre-seeded DB and copy it to /tmp on cold start.
 */
export function ensureDatabase(): string {
  if (process.env.NODE_ENV !== "production") {
    // In development, use the local prisma/dev.db
    return "file:./prisma/dev.db";
  }

  if (initialized && fs.existsSync(PROD_DB_PATH)) {
    return `file:${PROD_DB_PATH}`;
  }

  // Copy the pre-seeded DB to /tmp
  if (fs.existsSync(SOURCE_DB_PATH)) {
    fs.copyFileSync(SOURCE_DB_PATH, PROD_DB_PATH);
    console.log("[db-init] Copied seeded DB to /tmp/bloom.db");
  } else {
    console.warn("[db-init] No seeded DB found at", SOURCE_DB_PATH);
  }

  initialized = true;
  return `file:${PROD_DB_PATH}`;
}
