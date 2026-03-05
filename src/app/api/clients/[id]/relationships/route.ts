import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const INVERSE_TYPES: Record<string, string> = {
  Recipient: "Sender",
  Sender: "Recipient",
  Partner: "Partner",
  Friend: "Friend",
  Family: "Family",
  Other: "Other",
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { relatedClientId, relationshipType } = body as {
    relatedClientId: string;
    relationshipType: string;
  };

  if (!relatedClientId || !relationshipType) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Check for existing relationship
  const existing = await prisma.clientRelationship.findUnique({
    where: {
      clientId_relatedClientId: {
        clientId: id,
        relatedClientId,
      },
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Relationship already exists" },
      { status: 409 }
    );
  }

  // Create bidirectional relationships
  const inverseType = INVERSE_TYPES[relationshipType] || relationshipType;

  await prisma.$transaction([
    prisma.clientRelationship.create({
      data: { clientId: id, relatedClientId, relationshipType },
    }),
    prisma.clientRelationship.create({
      data: {
        clientId: relatedClientId,
        relatedClientId: id,
        relationshipType: inverseType,
      },
    }),
  ]);

  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const relatedId = searchParams.get("relatedId");

  if (!relatedId) {
    return NextResponse.json({ error: "Missing relatedId" }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.clientRelationship.deleteMany({
      where: { clientId: id, relatedClientId: relatedId },
    }),
    prisma.clientRelationship.deleteMany({
      where: { clientId: relatedId, relatedClientId: id },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
