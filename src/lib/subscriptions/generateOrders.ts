import { prisma } from "@/lib/prisma";
import { addDays, addMonths, startOfDay, endOfDay, lastDayOfMonth, setDate, getDate } from "date-fns";
import { generateOrderNumber } from "@/lib/utils/orderNumber";

function calculateNextDate(current: Date, frequency: string): Date {
  switch (frequency) {
    case "weekly":
      return addDays(current, 7);
    case "biweekly":
      return addDays(current, 14);
    case "monthly": {
      const nextMonth = addMonths(current, 1);
      const originalDay = getDate(current);
      const lastDay = getDate(lastDayOfMonth(nextMonth));
      if (originalDay > lastDay) {
        return setDate(nextMonth, lastDay);
      }
      return setDate(nextMonth, originalDay);
    }
    default:
      return addDays(current, 7);
  }
}

export async function generateSubscriptionOrders() {
  const today = new Date();
  const todayStart = startOfDay(today);
  const todayEnd = endOfDay(today);

  const activeSubs = await prisma.subscription.findMany({
    where: {
      status: "active",
      nextOrderDate: { lte: todayEnd },
    },
    include: { client: true },
  });

  let generated = 0;
  const createdOrders = [];

  for (const sub of activeSubs) {
    if (!sub.nextOrderDate) continue;

    // Idempotency check
    const existing = await prisma.order.findFirst({
      where: {
        subscriptionId: sub.id,
        deliveryDate: {
          gte: startOfDay(sub.nextOrderDate),
          lte: endOfDay(sub.nextOrderDate),
        },
      },
    });

    if (existing) continue;

    const orderNumber = await generateOrderNumber(sub.nextOrderDate);

    const order = await prisma.order.create({
      data: {
        orderNumber,
        clientId: sub.clientId,
        totalPrice: sub.price,
        deliveryDate: sub.nextOrderDate,
        deliveryMethod: sub.deliveryMethod,
        deliveryAddress: sub.deliveryAddress,
        status: "confirmed",
        isSubscriptionGenerated: true,
        subscriptionId: sub.id,
        paymentStatus: "unpaid",
        lineItems: {
          create: [{
            arrangementType: sub.arrangementType,
            flowers: sub.flowers || "[]",
            specialInstructions: sub.specialInstructions,
            price: sub.price,
            sortOrder: 0,
          }],
        },
      },
    });

    const nextDate = calculateNextDate(sub.nextOrderDate, sub.frequency);

    await prisma.subscription.update({
      where: { id: sub.id },
      data: {
        lastGeneratedDate: todayStart,
        nextOrderDate: nextDate,
      },
    });

    createdOrders.push(order);
    generated++;
  }

  if (generated > 0) {
    await prisma.notification.create({
      data: {
        type: "subscription",
        message: `${generated} subscription order(s) were automatically generated.`,
        read: false,
      },
    });
  }

  return { generated, orders: createdOrders };
}
