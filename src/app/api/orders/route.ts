import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/utils/orderNumber";
import { z } from "zod";

const LineItemSchema = z.object({
  arrangementType: z.string().optional(),
  description: z.string().optional(),
  flowers: z.array(z.object({
    variety: z.string(),
    color: z.string(),
    qty: z.number(),
  })).optional(),
  vaseOption: z.string().optional(),
  vaseDescription: z.string().optional(),
  wrapOption: z.string().optional(),
  cardRequired: z.boolean().optional(),
  cardMessage: z.string().optional(),
  specialInstructions: z.string().optional(),
  price: z.number().min(0).optional(),
  sortOrder: z.number().optional(),
});

const CreateOrderSchema = z.object({
  clientId: z.string().min(1),
  recipientName: z.string().optional(),
  recipientAddress: z.string().optional(),
  recipientPhone: z.string().optional(),
  occasion: z.string().optional(),
  locationType: z.string().optional(),
  paymentStatus: z.string().optional(),
  deliveryDate: z.string().min(1, "Delivery date is required"),
  deliveryTimeWindow: z.string().optional(),
  deliveryMethod: z.string().optional(),
  deliveryAddress: z.string().optional(),
  internalNotes: z.string().optional(),
  status: z.string().optional(),
  lineItems: z.array(LineItemSchema).optional(),
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
  const location = searchParams.get("location");

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
  if (location && location !== "all") where.locationType = location;

  const orders = await prisma.order.findMany({
    where,
    include: { client: true, lineItems: { orderBy: { sortOrder: "asc" } } },
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

  const lineItems = data.lineItems || [];
  const totalPrice = lineItems.reduce((sum, item) => sum + (item.price || 0), 0);

  const order = await prisma.order.create({
    data: {
      orderNumber,
      clientId: data.clientId,
      recipientName: data.recipientName,
      recipientAddress: data.recipientAddress,
      recipientPhone: data.recipientPhone,
      occasion: data.occasion,
      locationType: data.locationType || "indoor",
      totalPrice,
      paymentStatus: data.paymentStatus || "unpaid",
      deliveryDate,
      deliveryTimeWindow: data.deliveryTimeWindow,
      deliveryMethod: data.deliveryMethod || "delivery",
      deliveryAddress: data.deliveryAddress,
      internalNotes: data.internalNotes,
      status: data.status || "confirmed",
      createdBy: session.id,
      lineItems: {
        create: lineItems.map((item, idx) => ({
          arrangementType: item.arrangementType,
          description: item.description,
          flowers: JSON.stringify(item.flowers || []),
          vaseOption: item.vaseOption,
          vaseDescription: item.vaseDescription,
          wrapOption: item.wrapOption,
          cardRequired: item.cardRequired || false,
          cardMessage: item.cardMessage,
          specialInstructions: item.specialInstructions,
          price: item.price || 0,
          sortOrder: item.sortOrder ?? idx,
        })),
      },
    },
    include: { client: true, lineItems: { orderBy: { sortOrder: "asc" } } },
  });

  return NextResponse.json(order, { status: 201 });
}
