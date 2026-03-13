import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import LabelsPrintClient from "./LabelsPrintClient";

interface PageProps {
  searchParams: Promise<{ orderId?: string; date?: string }>;
}

interface LabelData {
  date: string;
  deliveryMethod: string;
  number: number;
  recipientName: string;
  address: string;
  items: string;
  itemLabel: string;
}

export default async function LabelsPage({ searchParams }: PageProps) {
  const { orderId, date } = await searchParams;

  const includeOpts = { client: true, lineItems: { orderBy: { sortOrder: "asc" as const } } };
  let orders: Awaited<ReturnType<typeof prisma.order.findMany<{ include: typeof includeOpts }>>>;
  if (orderId) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: includeOpts,
    });
    orders = order ? [order] : [];
  } else if (date) {
    const d = new Date(date);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    orders = await prisma.order.findMany({
      where: { deliveryDate: { gte: d, lt: next } },
      include: includeOpts,
      orderBy: { deliveryDate: "asc" },
    });
  } else {
    orders = [];
  }

  // Get settings for layout
  const layoutSetting = await prisma.setting.findUnique({
    where: { key: "label_layout" },
  });
  const layout = layoutSetting?.value || "2up";

  // Generate labels (split multi-item orders)
  const labels: LabelData[] = [];
  let deliveryNum = 0;

  for (const order of orders) {
    deliveryNum++;
    const dateStr = format(new Date(order.deliveryDate), "EEE MMM d").toUpperCase();
    const method = order.deliveryMethod.toUpperCase();
    const name = (
      order.recipientName ||
      order.client.name
    ).toUpperCase();
    const addr = (
      order.deliveryAddress ||
      order.recipientAddress ||
      ""
    ).toUpperCase();

    const lineItems = order.lineItems || [];
    const totalItems = lineItems.length || 1;

    if (lineItems.length > 0) {
      lineItems.forEach((item, idx) => {
        const flowers: Array<{ variety: string; qty: number }> = (() => {
          try { return JSON.parse(item.flowers); } catch { return []; }
        })();
        const itemDesc = flowers.length > 0
          ? flowers.map((f: { variety: string; qty: number }) => `${f.qty} X ${f.variety.toUpperCase()}`).join(", ")
          : `1 X ${(item.arrangementType || "ARRANGEMENT").toUpperCase()}`;

        labels.push({
          date: dateStr,
          deliveryMethod: method,
          number: deliveryNum,
          recipientName: name,
          address: addr,
          items: itemDesc,
          itemLabel: `ITEM ${idx + 1}/${totalItems}`,
        });
      });
    } else {
      labels.push({
        date: dateStr,
        deliveryMethod: method,
        number: deliveryNum,
        recipientName: name,
        address: addr,
        items: "1 X ARRANGEMENT",
        itemLabel: "ITEM 1/1",
      });
    }
  }

  const gridClass =
    layout === "4up"
      ? "grid grid-cols-2 grid-rows-2 gap-2"
      : "grid grid-cols-2 gap-2";

  return (
    <html>
      <head>
        <title>Delivery Labels</title>
        <style
          dangerouslySetInnerHTML={{
            __html: `
          body { font-family: Arial, sans-serif; margin: 0; padding: 10px; }
          .label { border: 1px solid #000; color: #CC0000; font-weight: bold; text-align: center; text-transform: uppercase; padding: 16px; page-break-inside: avoid; }
          .label-date { font-size: 12px; }
          .label-method { font-size: 14px; }
          .label-number { font-size: 48px; font-weight: 900; margin: 8px 0; }
          .label-name { font-size: 16px; font-weight: 900; }
          .label-address { font-size: 14px; font-weight: 900; }
          .label-items { font-size: 12px; margin-top: 8px; }
          .label-count { font-size: 12px; margin-top: 8px; }
          .labels-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
          @media print { @page { margin: 0.25in; } body { padding: 0; } }
        `,
          }}
        />
      </head>
      <body>
        <div className={gridClass}>
          {labels.map((label, i) => (
            <div key={i} className="label">
              <div className="label-date">{label.date}</div>
              <div className="label-method">{label.deliveryMethod}</div>
              <div className="label-number">#{label.number}</div>
              <div className="label-name">{label.recipientName}</div>
              <div className="label-address">{label.address}</div>
              <div className="label-items">{label.items}</div>
              <div className="label-count">{label.itemLabel}</div>
            </div>
          ))}
        </div>
        <LabelsPrintClient />
      </body>
    </html>
  );
}
