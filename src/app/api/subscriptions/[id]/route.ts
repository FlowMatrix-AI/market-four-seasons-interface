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
  const subscription = await prisma.subscription.findUnique({
    where: { id },
    include: { client: true, orders: { orderBy: { deliveryDate: "desc" } } },
  });

  if (!subscription) {
    return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
  }

  return NextResponse.json(subscription);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  const { flowers, startDate, endDate, nextOrderDate, ...rest } = body;
  const data: Record<string, unknown> = { ...rest };

  if (flowers !== undefined) data.flowers = JSON.stringify(flowers);
  if (startDate !== undefined) data.startDate = new Date(startDate);
  if (endDate !== undefined) data.endDate = new Date(endDate);
  if (nextOrderDate !== undefined) data.nextOrderDate = new Date(nextOrderDate);

  const subscription = await prisma.subscription.update({
    where: { id },
    data,
    include: { client: true },
  });

  return NextResponse.json(subscription);
}
