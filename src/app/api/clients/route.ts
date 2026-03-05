import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const CreateClientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postal: z.string().optional(),
  notes: z.string().optional(),
  preferences: z.array(z.string()).optional(),
});

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  const where = query
    ? {
        OR: [
          { name: { contains: query } },
          { phone: { contains: query } },
          { email: { contains: query } },
          { address: { contains: query } },
          { notes: { contains: query } },
        ],
      }
    : {};

  const clients = await prisma.client.findMany({
    where,
    include: {
      orders: { orderBy: { deliveryDate: "desc" }, take: 1 },
      subscriptions: { where: { status: "active" } },
    },
    orderBy: { name: "asc" },
    take: 100,
  });

  return NextResponse.json(clients);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const result = CreateClientSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  const { preferences, ...rest } = result.data;
  const client = await prisma.client.create({
    data: {
      ...rest,
      preferences: JSON.stringify(preferences || []),
    },
  });

  return NextResponse.json(client, { status: 201 });
}
