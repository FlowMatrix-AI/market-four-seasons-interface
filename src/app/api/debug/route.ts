import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const info: Record<string, unknown> = {
    cwd: process.cwd(),
    dirname: __dirname,
    nodeEnv: process.env.NODE_ENV,
    databaseUrl: process.env.DATABASE_URL ? "SET" : "NOT SET",
  };

  // Check various paths
  const paths = [
    process.cwd(),
    path.join(process.cwd(), "prisma"),
    "/tmp",
    "/var/task",
    "/var/task/prisma",
  ];

  for (const p of paths) {
    try {
      info[`ls:${p}`] = fs.readdirSync(p);
    } catch (e) {
      info[`ls:${p}`] = `ERROR: ${e}`;
    }
  }

  // Check if bloom.db exists at various locations
  const dbPaths = [
    path.join(process.cwd(), "prisma", "bloom.db"),
    "/tmp/bloom.db",
    "/var/task/prisma/bloom.db",
    path.join(__dirname, "..", "..", "prisma", "bloom.db"),
    path.join(__dirname, "..", "..", "..", "prisma", "bloom.db"),
  ];

  for (const p of dbPaths) {
    try {
      info[`exists:${p}`] = fs.existsSync(p);
      if (fs.existsSync(p)) {
        info[`size:${p}`] = fs.statSync(p).size;
      }
    } catch (e) {
      info[`exists:${p}`] = `ERROR: ${e}`;
    }
  }

  return NextResponse.json(info, { status: 200 });
}
