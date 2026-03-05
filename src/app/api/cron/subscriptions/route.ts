import { NextRequest, NextResponse } from "next/server";
import { generateSubscriptionOrders } from "@/lib/subscriptions/generateOrders";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("authorization")?.replace("Bearer ", "");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await generateSubscriptionOrders();
  return NextResponse.json({ ok: true, generated: result.generated });
}

export async function GET(request: NextRequest) {
  const secret = request.headers.get("authorization")?.replace("Bearer ", "");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await generateSubscriptionOrders();
  return NextResponse.json({ ok: true, generated: result.generated });
}
