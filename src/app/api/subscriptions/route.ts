import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const subscriptions = await prisma.subscription.findMany({
    include: { client: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(subscriptions);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const {
    clientId,
    frequency,
    startDate,
    arrangementType,
    flowers,
    specialInstructions,
    deliveryMethod,
    deliveryAddress,
    price,
  } = body;

  const subscription = await prisma.subscription.create({
    data: {
      clientId,
      frequency,
      startDate: new Date(startDate),
      arrangementType,
      flowers: JSON.stringify(flowers || []),
      specialInstructions,
      deliveryMethod: deliveryMethod || "delivery",
      deliveryAddress,
      price: price || 0,
      status: "active",
      nextOrderDate: new Date(startDate),
    },
  });

  return NextResponse.json(subscription, { status: 201 });
}
