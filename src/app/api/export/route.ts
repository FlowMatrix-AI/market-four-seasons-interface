import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "owner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const clients = await prisma.client.findMany({
    include: {
      specialDates: true,
      clientNotes: true,
      relationshipsA: true,
    },
  });

  const orders = await prisma.order.findMany();
  const subscriptions = await prisma.subscription.findMany();

  const data = { clients, orders, subscriptions, exportedAt: new Date().toISOString() };

  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": 'attachment; filename="bloom-export.json"',
    },
  });
}
