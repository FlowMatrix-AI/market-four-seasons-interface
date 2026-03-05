import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

export async function generateOrderNumber(date: Date): Promise<string> {
  const dateStr = format(date, "yyyyMMdd");
  const prefix = `BLM-${dateStr}-`;

  const lastOrder = await prisma.order.findFirst({
    where: { orderNumber: { startsWith: prefix } },
    orderBy: { orderNumber: "desc" },
  });

  let seq = 1;
  if (lastOrder) {
    const lastSeq = parseInt(lastOrder.orderNumber.split("-").pop() || "0", 10);
    seq = lastSeq + 1;
  }

  return `${prefix}${seq.toString().padStart(3, "0")}`;
}
