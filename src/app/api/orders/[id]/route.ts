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
  const order = await prisma.order.findUnique({
    where: { id },
    include: { client: true, subscription: true, lineItems: { orderBy: { sortOrder: "asc" } }, photos: { orderBy: { createdAt: "asc" } } },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  const { lineItems, deliveryDate, ...rest } = body;
  const data: Record<string, unknown> = { ...rest };

  if (deliveryDate !== undefined) {
    data.deliveryDate = new Date(deliveryDate);
  }

  // If lineItems are provided, delete existing and recreate
  if (lineItems !== undefined && Array.isArray(lineItems)) {
    await prisma.orderLineItem.deleteMany({ where: { orderId: id } });
    const totalPrice = lineItems.reduce((sum: number, item: Record<string, unknown>) => sum + ((item.price as number) || 0), 0);
    data.totalPrice = totalPrice;
  }

  const order = await prisma.order.update({
    where: { id },
    data: {
      ...data,
      ...(lineItems !== undefined && Array.isArray(lineItems)
        ? {
            lineItems: {
              create: lineItems.map((item: Record<string, unknown>, idx: number) => ({
                arrangementType: item.arrangementType as string | undefined,
                description: item.description as string | undefined,
                flowers: JSON.stringify((item.flowers as unknown[]) || []),
                vaseOption: item.vaseOption as string | undefined,
                vaseDescription: item.vaseDescription as string | undefined,
                wrapOption: item.wrapOption as string | undefined,
                cardRequired: (item.cardRequired as boolean) || false,
                cardMessage: item.cardMessage as string | undefined,
                specialInstructions: item.specialInstructions as string | undefined,
                price: (item.price as number) || 0,
                sortOrder: (item.sortOrder as number) ?? idx,
              })),
            },
          }
        : {}),
    },
    include: { client: true, lineItems: { orderBy: { sortOrder: "asc" } }, photos: { orderBy: { createdAt: "asc" } } },
  });

  return NextResponse.json(order);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "owner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.order.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
