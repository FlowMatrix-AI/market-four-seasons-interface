import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function listRecursive(dir: string, depth = 0, maxDepth = 2): string[] {
  if (depth > maxDepth) return [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const results: string[] = [];
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      results.push(full);
      if (entry.isDirectory()) {
        results.push(...listRecursive(full, depth + 1, maxDepth));
      }
    }
    return results;
  } catch {
    return [];
  }
}

export async function GET() {
  const info: Record<string, unknown> = {
    cwd: process.cwd(),
    dirname: __dirname,
    nodeEnv: process.env.NODE_ENV,
    databaseUrl: process.env.DATABASE_URL ? "SET" : "NOT SET",
  };

  // Check for prisma engine specifically
  const enginePaths = [
    "/var/task/src/generated/prisma",
    "/var/task/src/generated",
    "/ROOT/src/generated/prisma",
    "/var/task/.prisma/client",
    "/var/task/node_modules/.prisma/client",
    "/var/task/node_modules/@prisma/engines",
  ];

  for (const p of enginePaths) {
    try {
      if (fs.existsSync(p)) {
        info[`ls:${p}`] = fs.readdirSync(p).filter(f => f.includes("engine") || f.includes(".node") || f.includes(".so"));
      } else {
        info[`ls:${p}`] = "NOT FOUND";
      }
    } catch (e) {
      info[`ls:${p}`] = `ERROR: ${e}`;
    }
  }

  // Check /var/task/src/ structure
  info["src_tree"] = listRecursive("/var/task/src", 0, 1);

  // Look for any .so.node files
  try {
    const allGenerated = listRecursive("/var/task/src/generated", 0, 3);
    info["generated_files"] = allGenerated.filter(f => f.endsWith(".node") || f.endsWith(".so"));
  } catch {
    info["generated_files"] = "ERROR";
  }

  // Check bloom.db
  info["bloom_db_task"] = fs.existsSync("/var/task/prisma/bloom.db");
  info["bloom_db_tmp"] = fs.existsSync("/tmp/bloom.db");

  return NextResponse.json(info, { status: 200 });
}
