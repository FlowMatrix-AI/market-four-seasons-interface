import { prisma } from "@/lib/prisma";

export async function generateInvoiceNumber(): Promise<string> {
  const lastOrder = await prisma.order.findFirst({
    where: { invoiceNumber: { not: null } },
    orderBy: { invoiceNumber: "desc" },
  });

  let next = 1;
  if (lastOrder?.invoiceNumber) {
    next = parseInt(lastOrder.invoiceNumber, 10) + 1;
  }

  return next.toString().padStart(5, "0");
}
