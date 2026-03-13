"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { TableSkeleton } from "@/components/ui/LoadingSkeleton";
import { Plus } from "lucide-react";

interface OrderData {
  id: string;
  orderNumber: string;
  deliveryDate: string;
  deliveryMethod: string;
  locationType: string;
  status: string;
  paymentStatus: string;
  totalPrice: number;
  client: { id: string; name: string };
  lineItems: { id: string; arrangementType: string | null; price: number }[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      if (res.ok) setOrders(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold">All Orders</h2>
        <Link
          href="/orders/new"
          className="bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-semibold px-3 py-1.5 rounded-md flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> New Order
        </Link>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg border border-neutral-200 p-8 text-center">
          <p className="text-sm text-neutral-400">No orders yet</p>
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-100 border-b border-neutral-200">
              <th className="text-left text-xs font-semibold text-neutral-600 uppercase tracking-wide px-4 py-3">
                Order #
              </th>
              <th className="text-left text-xs font-semibold text-neutral-600 uppercase tracking-wide px-4 py-3">
                Client
              </th>
              <th className="text-left text-xs font-semibold text-neutral-600 uppercase tracking-wide px-4 py-3">
                Date
              </th>
              <th className="text-left text-xs font-semibold text-neutral-600 uppercase tracking-wide px-4 py-3">
                Location
              </th>
              <th className="text-left text-xs font-semibold text-neutral-600 uppercase tracking-wide px-4 py-3">
                Method
              </th>
              <th className="text-left text-xs font-semibold text-neutral-600 uppercase tracking-wide px-4 py-3">
                Items
              </th>
              <th className="text-left text-xs font-semibold text-neutral-600 uppercase tracking-wide px-4 py-3">
                Status
              </th>
              <th className="text-left text-xs font-semibold text-neutral-600 uppercase tracking-wide px-4 py-3">
                Total
              </th>
              <th className="text-left text-xs font-semibold text-neutral-600 uppercase tracking-wide px-4 py-3">
                Payment
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr
                key={o.id}
                onClick={() => window.location.href = `/orders/${o.id}`}
                className="border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer"
              >
                <td className="px-4 py-3 text-sm font-medium">
                  {o.orderNumber}
                </td>
                <td className="px-4 py-3 text-sm">{o.client.name}</td>
                <td className="px-4 py-3 text-sm">
                  {format(new Date(o.deliveryDate), "MMM d, yyyy")}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                    o.locationType === "outdoor"
                      ? "bg-green-100 text-green-700"
                      : "bg-pink-100 text-pink-700"
                  }`}>
                    {o.locationType}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={o.deliveryMethod as "delivery" | "pickup"}>
                    {o.deliveryMethod}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm">{o.lineItems?.length || 0}</td>
                <td className="px-4 py-3">
                  <Badge variant={o.status as "confirmed" | "delivered"}>
                    {o.status.replace("_", " ")}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm">${o.totalPrice.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <Badge variant={o.paymentStatus as "paid" | "unpaid" | "partial"}>
                    {o.paymentStatus}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
