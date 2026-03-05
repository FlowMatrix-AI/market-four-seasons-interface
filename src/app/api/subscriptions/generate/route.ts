import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { generateSubscriptionOrders } from "@/lib/subscriptions/generateOrders";

export async function POST(request: NextRequest) {
  // Allow either authenticated user or cron secret
  const cronSecret = request.headers.get("x-cron-secret");
  if (cronSecret !== process.env.CRON_SECRET) {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const result = await generateSubscriptionOrders();
  return NextResponse.json({ count: result.generated, orders: result.orders });
}
