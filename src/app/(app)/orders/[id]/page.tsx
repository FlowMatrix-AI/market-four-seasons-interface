"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useAuth } from "@/lib/context/AuthContext";
import { useToast } from "@/lib/context/ToastContext";
import Badge from "@/components/ui/Badge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { PageSkeleton } from "@/components/ui/LoadingSkeleton";
import {
  ChevronLeft,
  Pencil,
  Copy,
  Printer,
  Tag,
  Trash2,
  ImageIcon,
} from "lucide-react";

interface FlowerRow {
  variety: string;
  color: string;
  qty: number;
}

interface OrderLineItem {
  id: string;
  orderId: string;
  arrangementType: string | null;
  description: string | null;
  flowers: string | null;
  vaseOption: string | null;
  vaseDescription: string | null;
  wrapOption: string | null;
  cardRequired: boolean;
  cardMessage: string | null;
  specialInstructions: string | null;
  price: number;
  sortOrder: number;
}

interface OrderPhoto {
  id: string;
  url: string;
  photoType: string;
}

interface OrderData {
  id: string;
  orderNumber: string;
  clientId: string;
  recipientName: string | null;
  recipientAddress: string | null;
  recipientPhone: string | null;
  occasion: string | null;
  locationType: string | null;
  totalPrice: number;
  paymentStatus: string;
  deliveryDate: string;
  deliveryTimeWindow: string | null;
  deliveryMethod: string;
  deliveryAddress: string | null;
  internalNotes: string | null;
  status: string;
  isSubscriptionGenerated: boolean;
  invoiceNumber: string | null;
  createdBy: string | null;
  createdAt: string;
  client: { id: string; name: string; phone: string | null };
  lineItems: OrderLineItem[];
  photos: OrderPhoto[];
}

const STATUS_OPTIONS = [
  "draft",
  "confirmed",
  "in_progress",
  "ready",
  "delivered",
  "cancelled",
] as const;

function parseFlowers(json: string | null): FlowerRow[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { isOwner } = useAuth();
  const { addToast } = useToast();

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${id}`);
      if (res.ok) {
        setOrder(await res.json());
      } else {
        addToast("error", "Failed to load order");
      }
    } catch {
      addToast("error", "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!order || order.status === newStatus) return;
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrder((prev) => (prev ? { ...prev, status: newStatus } : prev));
        addToast("success", `Status updated to ${newStatus.replace("_", " ")}`);
      } else {
        addToast("error", "Failed to update status");
      }
    } catch {
      addToast("error", "Network error");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
      if (res.ok) {
        addToast("success", "Order deleted");
        router.push("/orders");
      } else {
        addToast("error", "Failed to delete order");
      }
    } catch {
      addToast("error", "Network error");
    }
  };

  const handleDuplicate = () => {
    if (!order) return;
    const params = new URLSearchParams();
    params.set("duplicateFrom", order.id);
    router.push(`/orders/new?${params.toString()}`);
  };

  if (loading) return <PageSkeleton />;
  if (!order)
    return <p className="text-sm text-neutral-400">Order not found</p>;

  const referencePhotos = order.photos.filter(
    (p) => p.photoType === "reference"
  );
  const completionPhotos = order.photos.filter(
    (p) => p.photoType === "completion"
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/orders"
          className="text-sm text-neutral-400 hover:text-neutral-600 flex items-center gap-1 mb-3"
        >
          <ChevronLeft className="w-4 h-4" /> Orders
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold">
              Order {order.orderNumber}
            </h2>
            <div className="flex items-center gap-3 mt-1">
              <Badge variant={order.status as "confirmed" | "delivered"}>
                {order.status.replace("_", " ")}
              </Badge>
              <Badge
                variant={
                  order.paymentStatus as "paid" | "unpaid" | "partial"
                }
              >
                {order.paymentStatus}
              </Badge>
              <Badge
                variant={order.deliveryMethod as "delivery" | "pickup"}
              >
                {order.deliveryMethod}
              </Badge>
              {order.isSubscriptionGenerated && (
                <Badge variant="subscription">subscription</Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/orders/${id}/edit`}
              className="border border-brand-primary text-brand-primary hover:bg-brand-accent text-sm font-semibold px-3 py-1.5 rounded-md flex items-center gap-1"
            >
              <Pencil className="w-4 h-4" /> Edit
            </Link>
            <button
              onClick={handleDuplicate}
              className="border border-neutral-200 text-neutral-600 hover:bg-neutral-100 text-sm font-semibold px-3 py-1.5 rounded-md flex items-center gap-1"
            >
              <Copy className="w-4 h-4" /> Duplicate
            </button>
            <button
              onClick={() =>
                window.open(`/print/invoice/${id}`, "_blank")
              }
              className="border border-neutral-200 text-neutral-600 hover:bg-neutral-100 text-sm font-semibold px-3 py-1.5 rounded-md flex items-center gap-1"
            >
              <Printer className="w-4 h-4" /> Invoice
            </button>
            <button
              onClick={() =>
                window.open(
                  `/print/labels?orderId=${id}`,
                  "_blank"
                )
              }
              className="border border-neutral-200 text-neutral-600 hover:bg-neutral-100 text-sm font-semibold px-3 py-1.5 rounded-md flex items-center gap-1"
            >
              <Tag className="w-4 h-4" /> Label
            </button>
            {isOwner && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="border border-red-200 text-danger hover:bg-red-50 text-sm font-semibold px-3 py-1.5 rounded-md flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Status Quick-Change Chips */}
      <div className="bg-white rounded-lg border border-neutral-200 p-4 shadow-sm mb-6">
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">
          Quick Status
        </p>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              className={`text-xs px-3 py-1 rounded-full font-semibold transition-colors ${
                order.status === s
                  ? "bg-brand-primary text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Order Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Client & Recipient */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4 shadow-sm">
          <h3 className="text-base font-semibold mb-3">
            Client & Recipient
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                Client (Sender)
              </p>
              <Link
                href={`/customers/${order.client.id}`}
                className="text-sm text-brand-primary hover:underline"
              >
                {order.client.name}
              </Link>
              {order.client.phone && (
                <p className="text-sm text-neutral-600">
                  {order.client.phone}
                </p>
              )}
            </div>
            {order.recipientName && (
              <div>
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                  Recipient
                </p>
                <p className="text-sm">{order.recipientName}</p>
                {order.recipientPhone && (
                  <p className="text-sm text-neutral-600">
                    {order.recipientPhone}
                  </p>
                )}
                {order.recipientAddress && (
                  <p className="text-sm text-neutral-600">
                    {order.recipientAddress}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Delivery Details */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4 shadow-sm">
          <h3 className="text-base font-semibold mb-3">
            Delivery Details
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                Delivery Date
              </p>
              <p className="text-sm">
                {format(new Date(order.deliveryDate), "EEEE, MMMM d, yyyy")}
              </p>
            </div>
            {order.deliveryTimeWindow && (
              <div>
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                  Time Window
                </p>
                <p className="text-sm">{order.deliveryTimeWindow}</p>
              </div>
            )}
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                Method
              </p>
              <p className="text-sm capitalize">{order.deliveryMethod}</p>
            </div>
            {order.deliveryAddress && (
              <div>
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                  Delivery Address
                </p>
                <p className="text-sm">{order.deliveryAddress}</p>
              </div>
            )}
            {order.occasion && (
              <div>
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                  Occasion
                </p>
                <p className="text-sm">{order.occasion}</p>
              </div>
            )}
            {order.locationType && (
              <div>
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                  Location Type
                </p>
                <p className="text-sm">{order.locationType}</p>
              </div>
            )}
          </div>
        </div>

        {/* Pricing & Payment */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4 shadow-sm">
          <h3 className="text-base font-semibold mb-3">
            Pricing & Payment
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                Total Price
              </p>
              <p className="text-lg font-bold">
                ${order.totalPrice.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                Payment Status
              </p>
              <Badge
                variant={
                  order.paymentStatus as "paid" | "unpaid" | "partial"
                }
              >
                {order.paymentStatus}
              </Badge>
            </div>
            {order.invoiceNumber && (
              <div>
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                  Invoice Number
                </p>
                <p className="text-sm">{order.invoiceNumber}</p>
              </div>
            )}
          </div>
        </div>

        {/* Meta */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4 shadow-sm">
          <h3 className="text-base font-semibold mb-3">Details</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                Created
              </p>
              <p className="text-sm">
                {format(new Date(order.createdAt), "MMM d, yyyy h:mm a")}
              </p>
            </div>
            {order.createdBy && (
              <div>
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                  Created By
                </p>
                <p className="text-sm">{order.createdBy}</p>
              </div>
            )}
            {order.internalNotes && (
              <div>
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                  Internal Notes
                </p>
                <p className="text-sm whitespace-pre-wrap">
                  {order.internalNotes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="bg-white rounded-lg border border-neutral-200 p-4 shadow-sm mb-6">
        <h3 className="text-base font-semibold mb-3">
          Line Items ({order.lineItems.length})
        </h3>
        {order.lineItems.length === 0 ? (
          <p className="text-sm text-neutral-400">No line items</p>
        ) : (
          <div className="space-y-4">
            {order.lineItems
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((item, idx) => {
                const flowers = parseFlowers(item.flowers);
                return (
                  <div
                    key={item.id}
                    className="border border-neutral-100 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                          Item {idx + 1}
                        </span>
                        {item.arrangementType && (
                          <p className="text-sm font-semibold">
                            {item.arrangementType}
                          </p>
                        )}
                      </div>
                      <p className="text-sm font-bold">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>

                    {item.description && (
                      <p className="text-sm text-neutral-600 mb-2">
                        {item.description}
                      </p>
                    )}

                    {flowers.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-1">
                          Flowers
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {flowers.map((f, fi) => (
                            <span
                              key={fi}
                              className="bg-brand-accent text-brand-primary text-xs px-2 py-0.5 rounded-full"
                            >
                              {f.qty}x {f.variety}
                              {f.color ? ` (${f.color})` : ""}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                      {item.vaseOption && (
                        <div>
                          <span className="text-neutral-400">Vase:</span>{" "}
                          {item.vaseOption}
                          {item.vaseDescription &&
                            ` - ${item.vaseDescription}`}
                        </div>
                      )}
                      {item.wrapOption && (
                        <div>
                          <span className="text-neutral-400">Wrap:</span>{" "}
                          {item.wrapOption}
                        </div>
                      )}
                    </div>

                    {item.cardRequired && item.cardMessage && (
                      <div className="mt-2 bg-neutral-50 rounded-md p-2">
                        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-1">
                          Card Message
                        </p>
                        <p className="text-sm italic">
                          &ldquo;{item.cardMessage}&rdquo;
                        </p>
                      </div>
                    )}

                    {item.specialInstructions && (
                      <div className="mt-2">
                        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                          Special Instructions
                        </p>
                        <p className="text-sm text-neutral-600">
                          {item.specialInstructions}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Photos */}
      {(referencePhotos.length > 0 || completionPhotos.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {referencePhotos.length > 0 && (
            <div className="bg-white rounded-lg border border-neutral-200 p-4 shadow-sm">
              <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> Reference Photos
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {referencePhotos.map((photo) => (
                  <a
                    key={photo.id}
                    href={photo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={photo.url}
                      alt="Reference"
                      className="w-full h-24 object-cover rounded-md border border-neutral-200"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
          {completionPhotos.length > 0 && (
            <div className="bg-white rounded-lg border border-neutral-200 p-4 shadow-sm">
              <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> Completion Photos
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {completionPhotos.map((photo) => (
                  <a
                    key={photo.id}
                    href={photo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={photo.url}
                      alt="Completion"
                      className="w-full h-24 object-cover rounded-md border border-neutral-200"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Order"
        message={`Are you sure you want to delete order ${order.orderNumber}? This action cannot be undone.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}
