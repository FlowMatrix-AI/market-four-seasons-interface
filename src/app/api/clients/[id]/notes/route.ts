import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const notes = await prisma.clientNote.findMany({
    where: { clientId: id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(notes);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { body: noteBody } = body as { body: string };

  if (!noteBody?.trim()) {
    return NextResponse.json({ error: "Note body is required" }, { status: 400 });
  }

  const note = await prisma.clientNote.create({
    data: {
      clientId: id,
      body: noteBody,
      createdBy: session.id,
    },
  });

  return NextResponse.json(note, { status: 201 });
}
