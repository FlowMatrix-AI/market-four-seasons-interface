import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { label, month, day } = body as { label: string; month: number; day: number };

  if (!label || !month || !day) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const date = await prisma.specialDate.create({
    data: { clientId: id, label, month, day },
  });

  return NextResponse.json(date, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "owner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const dateId = searchParams.get("dateId");

  if (!dateId) {
    return NextResponse.json({ error: "Missing dateId" }, { status: 400 });
  }

  await prisma.specialDate.delete({ where: { id: dateId } });
  return NextResponse.json({ ok: true });
}
