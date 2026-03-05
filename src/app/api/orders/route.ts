import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/utils/orderNumber";
import { z } from "zod";

const CreateOrderSchema = z.object({
  clientId: z.string().min(1),
  recipientName: z.string().optional(),
  recipientAddress: z.string().optional(),
  recipientPhone: z.string().optional(),
  occasion: z.string().optional(),
  arrangementType: z.string().optional(),
  flowers: z.array(z.object({
    variety: z.string(),
    color: z.string(),
    qty: z.number(),
  })).optional(),
  specialInstructions: z.string().optional(),
  cardRequired: z.boolean().optional(),
  cardMessage: z.string().optional(),
  price: z.number().min(0).optional(),
  itemCount: z.number().min(1).optional(),
  paymentStatus: z.string().optional(),
  deliveryDate: z.string().min(1, "Delivery date is required"),
  deliveryTimeWindow: z.string().optional(),
  deliveryMethod: z.string().optional(),
  deliveryAddress: z.string().optional(),
  internalNotes: z.string().optional(),
  status: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const clientId = searchParams.get("clientId");
  const status = searchParams.get("status");

  const where: Record<string, unknown> = {};

  if (date) {
    const d = new Date(date);
    const nextD = new Date(d);
    nextD.setDate(nextD.getDate() + 1);
    where.deliveryDate = { gte: d, lt: nextD };
  } else if (start && end) {
    where.deliveryDate = { gte: new Date(start), lte: new Date(end) };
  }

  if (clientId) where.clientId = clientId;
  if (status) where.status = status;

  const orders = await prisma.order.findMany({
    where,
    include: { client: true },
    orderBy: { deliveryDate: "asc" },
    take: 200,
  });

  return NextResponse.json(orders);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const result = CreateOrderSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  const data = result.data;
  const deliveryDate = new Date(data.deliveryDate);
  const orderNumber = await generateOrderNumber(deliveryDate);

  const order = await prisma.order.create({
    data: {
      orderNumber,
      clientId: data.clientId,
      recipientName: data.recipientName,
      recipientAddress: data.recipientAddress,
      recipientPhone: data.recipientPhone,
      occasion: data.occasion,
      arrangementType: data.arrangementType,
      flowers: JSON.stringify(data.flowers || []),
      specialInstructions: data.specialInstructions,
      cardRequired: data.cardRequired || false,
      cardMessage: data.cardMessage,
      price: data.price || 0,
      itemCount: data.itemCount || 1,
      paymentStatus: data.paymentStatus || "unpaid",
      deliveryDate,
      deliveryTimeWindow: data.deliveryTimeWindow,
      deliveryMethod: data.deliveryMethod || "delivery",
      deliveryAddress: data.deliveryAddress,
      internalNotes: data.internalNotes,
      status: data.status || "confirmed",
      createdBy: session.id,
    },
    include: { client: true },
  });

  return NextResponse.json(order, { status: 201 });
}
