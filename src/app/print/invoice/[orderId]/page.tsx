import { prisma } from "@/lib/prisma";
import { calculateHST, calculateTotal, calculateBalance } from "@/lib/utils/invoiceMath";
import { generateInvoiceNumber } from "@/lib/utils/invoiceNumber";
import { format } from "date-fns";
import InvoicePrintClient from "./InvoicePrintClient";

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export default async function InvoicePage({ params }: PageProps) {
  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { client: true, lineItems: { orderBy: { sortOrder: "asc" } } },
  });

  if (!order) {
    return <div>Order not found</div>;
  }

  // Assign invoice number if not present
  if (!order.invoiceNumber) {
    const invoiceNum = await generateInvoiceNumber();
    await prisma.order.update({
      where: { id: orderId },
      data: { invoiceNumber: invoiceNum },
    });
    order.invoiceNumber = invoiceNum;
  }

  const settings = await prisma.setting.findMany();
  const settingsMap: Record<string, string> = {};
  for (const s of settings) {
    settingsMap[s.key] = s.value;
  }

  const shopName = settingsMap.shop_name || "Market Four Seasons";
  const shopAddress = settingsMap.shop_address || "2032 Avenue Rd, Toronto, ON M5M 2R8";
  const shopPhone = settingsMap.shop_phone || "(416) 481-0102";
  const shopEmail = settingsMap.shop_email || "marketfourseasons@gmail.com";
  const shopHst = settingsMap.shop_hst || "867392979";

  const subtotal = order.totalPrice;
  const hst = calculateHST(subtotal);
  const total = calculateTotal(subtotal, hst);
  const paid = order.paymentStatus === "paid" ? total : order.paymentStatus === "partial" ? subtotal * 0.5 : 0;
  const balance = calculateBalance(total, paid);

  const lineItems = order.lineItems || [];

  return (
    <html>
      <head>
        <title>Invoice #{order.invoiceNumber}</title>
        <style
          dangerouslySetInnerHTML={{
            __html: `
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #000; font-size: 12px; }
          .invoice { max-width: 800px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .shop-info { text-align: left; }
          .shop-name { font-size: 18px; font-weight: bold; }
          .invoice-info { text-align: right; }
          .invoice-number { font-size: 16px; font-weight: bold; }
          .section-header { background: #7BA05B; color: white; font-weight: bold; padding: 4px 8px; margin-top: 15px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 8px; }
          table.items { width: 100%; border-collapse: collapse; margin-top: 15px; }
          table.items th { border-bottom: 2px solid #000; text-align: left; padding: 6px; font-size: 11px; }
          table.items td { border-bottom: 1px solid #ccc; padding: 6px; }
          .totals { display: flex; justify-content: space-between; margin-top: 15px; }
          .totals-right { text-align: right; }
          .totals-right div { padding: 2px 0; }
          .total-label { font-weight: bold; }
          @media print { body { margin: 0; } @page { margin: 0.5in; } }
        `,
          }}
        />
      </head>
      <body>
        <div className="invoice">
          <div className="header">
            <div className="shop-info">
              <div className="shop-name">{shopName}</div>
              <div>{shopAddress}</div>
              <div>TEL: {shopPhone}</div>
              <div>{shopEmail}</div>
            </div>
            <div className="invoice-info">
              <div className="invoice-number">
                INVOICE #{order.invoiceNumber}
              </div>
              <div>
                DELIVERY DATE:{" "}
                {format(new Date(order.deliveryDate), "MMMM d, yyyy")}
              </div>
              <div>HST # {shopHst}</div>
            </div>
          </div>

          <div className="section-header">CUSTOMER INFO:</div>
          <div className="info-grid">
            <div>
              <strong>NAME:</strong> {order.client.name}
              <br />
              <strong>ADDRESS:</strong> {order.client.address || "N/A"}
              <br />
              <strong>CONTACT:</strong> {order.client.phone || "N/A"}
            </div>
          </div>

          <div className="section-header">DELIVERY INFO:</div>
          <div className="info-grid">
            <div>
              <strong>Address:</strong>{" "}
              {order.deliveryAddress || order.recipientAddress || "N/A"}
              {order.recipientName && (
                <>
                  <br />
                  <strong>To:</strong> {order.recipientName}
                </>
              )}
            </div>
          </div>

          <table className="items">
            <thead>
              <tr>
                <th>QTY</th>
                <th>DESCRIPTION</th>
                <th>UNIT PRICE</th>
                <th>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.length > 0 ? (
                lineItems.map((item, i) => {
                  const flowers: Array<{ variety: string; color: string; qty: number }> = (() => {
                    try { return JSON.parse(item.flowers); } catch { return []; }
                  })();
                  const flowerDesc = flowers.map(f => `${f.qty}x ${f.variety} (${f.color})`).join(", ");
                  return (
                    <tr key={i}>
                      <td>1</td>
                      <td>
                        {item.arrangementType || "Item"}
                        {item.description ? ` - ${item.description}` : ""}
                        {flowerDesc ? ` [${flowerDesc}]` : ""}
                      </td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>${item.price.toFixed(2)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td>1</td>
                  <td>Arrangement</td>
                  <td>${order.totalPrice.toFixed(2)}</td>
                  <td>${order.totalPrice.toFixed(2)}</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="totals">
            <div>
              <strong>TOTAL # OF ITEMS:</strong> {lineItems.length || 1}
              {order.internalNotes && (
                <div style={{ marginTop: 10 }}>
                  <strong>Comments:</strong>
                  <br />
                  {order.internalNotes}
                </div>
              )}
            </div>
            <div className="totals-right">
              <div>
                SUBTOTAL: <strong>${subtotal.toFixed(2)}</strong>
              </div>
              <div>
                HST (13%): <strong>${hst.toFixed(2)}</strong>
              </div>
              <div className="total-label">
                TOTAL: <strong>${total.toFixed(2)}</strong>
              </div>
              <div>
                PAID: <strong>${paid.toFixed(2)}</strong>
              </div>
              <div className="total-label">
                BALANCE: <strong>${balance.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        </div>
        <InvoicePrintClient />
      </body>
    </html>
  );
}
