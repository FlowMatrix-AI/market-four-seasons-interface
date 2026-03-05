"use client";

import { useState, useEffect, useCallback } from "react";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/lib/context/ToastContext";
import { useAuth } from "@/lib/context/AuthContext";
import { Printer, Copy, Trash2, Pencil } from "lucide-react";
import { format } from "date-fns";
import OrderFormModal from "./OrderFormModal";

interface OrderDetail {
  id: string;
  orderNumber: string;
  clientId: string;
  recipientName: string | null;
  recipientAddress: string | null;
  recipientPhone: string | null;
  occasion: string | null;
  arrangementType: string | null;
  flowers: string;
  specialInstructions: string | null;
  cardRequired: boolean;
  cardMessage: string | null;
  price: number;
  itemCount: number;
  paymentStatus: string;
  deliveryDate: string;
  deliveryTimeWindow: string | null;
  deliveryMethod: string;
  deliveryAddress: string | null;
  internalNotes: string | null;
  status: string;
  invoiceNumber: string | null;
  isSubscriptionGenerated: boolean;
  createdAt: string;
  client: { id: string; name: string; phone: string | null };
}

interface OrderDetailModalProps {
  orderId: string;
  onClose: () => void;
  onUpdated: () => void;
}

const STATUS_OPTIONS = [
  "draft",
  "confirmed",
  "in_progress",
  "ready",
  "delivered",
  "cancelled",
];

export default function OrderDetailModal({
  orderId,
  onClose,
  onUpdated,
}: OrderDetailModalProps) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDuplicate, setShowDuplicate] = useState(false);
  const { addToast } = useToast();
  const { isOwner } = useAuth();

  const loadOrder = useCallback(async () => {
    try {
      const r = await fetch(`/api/orders/${orderId}`);
      const data = await r.json();
      setOrder(data);
    } catch {
      addToast("error", "Failed to load order");
    } finally {
      setLoading(false);
    }
  }, [orderId, addToast]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const updateStatus = async (newStatus: string) => {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setOrder((prev) => (prev ? { ...prev, status: newStatus } : prev));
      addToast("success", `Status updated to ${newStatus.replace("_", " ")}`);
      onUpdated();
    }
  };

  const handleDelete = async () => {
    const res = await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
    if (res.ok) {
      addToast("success", "Order deleted");
      onClose();
      onUpdated();
    } else {
      addToast("error", "Failed to delete order");
    }
  };

  const flowers = order
    ? (() => {
        try {
          return JSON.parse(order.flowers);
        } catch {
          return [];
        }
      })()
    : [];

  if (loading || !order) {
    return (
      <Modal open={true} onClose={onClose} title="Order Details">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-neutral-200 rounded w-1/2" />
          <div className="h-4 bg-neutral-200 rounded w-3/4" />
          <div className="h-4 bg-neutral-200 rounded w-2/3" />
        </div>
      </Modal>
    );
  }

  return (
    <>
      <Modal
        open={true}
        onClose={onClose}
        title={`Order ${order.orderNumber}`}
        footer={
          <div className="flex gap-2 w-full justify-between">
            <div className="flex gap-2">
              {isOwner && (
                <button
                  onClick={() => setShowDelete(true)}
                  className="bg-danger hover:bg-red-700 text-white text-sm font-semibold px-3 py-2 rounded-md flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDuplicate(true)}
                className="border border-neutral-200 text-neutral-600 hover:bg-neutral-100 text-sm px-3 py-2 rounded-md flex items-center gap-1"
              >
                <Copy className="w-4 h-4" /> Duplicate
              </button>
              <button
                onClick={() => setShowEdit(true)}
                className="border border-brand-primary text-brand-primary hover:bg-brand-accent text-sm font-semibold px-3 py-2 rounded-md flex items-center gap-1"
              >
                <Pencil className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={() =>
                  window.open(`/print/invoice/${order.id}`, "_blank")
                }
                className="border border-neutral-200 text-neutral-600 hover:bg-neutral-100 text-sm px-3 py-2 rounded-md flex items-center gap-1"
              >
                <Printer className="w-4 h-4" /> Invoice
              </button>
              <button
                onClick={() =>
                  window.open(`/print/labels?orderId=${order.id}`, "_blank")
                }
                className="border border-neutral-200 text-neutral-600 hover:bg-neutral-100 text-sm px-3 py-2 rounded-md flex items-center gap-1"
              >
                <Printer className="w-4 h-4" /> Label
              </button>
            </div>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Status chips */}
          <div>
            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
              Status
            </label>
            <div className="flex flex-wrap gap-2 mt-1">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-400 uppercase">
                Client
              </label>
              <p className="text-sm">{order.client.name}</p>
            </div>
            {order.recipientName && (
              <div>
                <label className="text-xs font-semibold text-neutral-400 uppercase">
                  Recipient
                </label>
                <p className="text-sm">{order.recipientName}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-400 uppercase">
                Delivery Date
              </label>
              <p className="text-sm">
                {format(new Date(order.deliveryDate), "MMM d, yyyy")}
              </p>
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-400 uppercase">
                Time
              </label>
              <p className="text-sm">{order.deliveryTimeWindow || "Not set"}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-400 uppercase">
                Method
              </label>
              <Badge variant={order.deliveryMethod as "delivery" | "pickup"}>
                {order.deliveryMethod}
              </Badge>
            </div>
          </div>

          {order.deliveryAddress && (
            <div>
              <label className="text-xs font-semibold text-neutral-400 uppercase">
                Delivery Address
              </label>
              <p className="text-sm">{order.deliveryAddress}</p>
            </div>
          )}

          {order.occasion && (
            <div>
              <label className="text-xs font-semibold text-neutral-400 uppercase">
                Occasion
              </label>
              <p className="text-sm">{order.occasion}</p>
            </div>
          )}

          {order.arrangementType && (
            <div>
              <label className="text-xs font-semibold text-neutral-400 uppercase">
                Arrangement
              </label>
              <p className="text-sm">{order.arrangementType}</p>
            </div>
          )}

          {flowers.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-neutral-400 uppercase">
                Flowers
              </label>
              <div className="space-y-1 mt-1">
                {(flowers as Array<{ variety: string; color: string; qty: number }>).map(
                  (f: { variety: string; color: string; qty: number }, i: number) => (
                    <p key={i} className="text-sm">
                      {f.qty}x {f.variety} ({f.color})
                    </p>
                  )
                )}
              </div>
            </div>
          )}

          {order.specialInstructions && (
            <div>
              <label className="text-xs font-semibold text-neutral-400 uppercase">
                Special Instructions
              </label>
              <p className="text-sm">{order.specialInstructions}</p>
            </div>
          )}

          {order.cardRequired && (
            <div>
              <label className="text-xs font-semibold text-neutral-400 uppercase">
                Card Message
              </label>
              <p className="text-sm italic">
                {order.cardMessage || "(No message)"}
              </p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-400 uppercase">
                Price
              </label>
              <p className="text-sm font-semibold">${order.price.toFixed(2)}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-400 uppercase">
                Items
              </label>
              <p className="text-sm">{order.itemCount}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-400 uppercase">
                Payment
              </label>
              <Badge
                variant={order.paymentStatus as "paid" | "unpaid" | "partial"}
              >
                {order.paymentStatus}
              </Badge>
            </div>
          </div>

          {order.internalNotes && (
            <div>
              <label className="text-xs font-semibold text-neutral-400 uppercase">
                Internal Notes
              </label>
              <p className="text-sm text-neutral-600">{order.internalNotes}</p>
            </div>
          )}
        </div>
      </Modal>

      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Order"
        message={`Are you sure you want to delete order ${order.orderNumber}? This cannot be undone.`}
        confirmLabel="Delete"
        danger
      />

      {showEdit && (
        <OrderFormModal
          open={showEdit}
          onClose={() => setShowEdit(false)}
          onSaved={() => {
            setShowEdit(false);
            onUpdated();
            onClose();
          }}
          initialClientId={order.clientId}
        />
      )}

      {showDuplicate && (
        <OrderFormModal
          open={showDuplicate}
          onClose={() => setShowDuplicate(false)}
          onSaved={() => {
            setShowDuplicate(false);
            onUpdated();
          }}
          duplicateFrom={order as unknown as Record<string, unknown>}
        />
      )}
    </>
  );
}
