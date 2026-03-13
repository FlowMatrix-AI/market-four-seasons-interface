"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useToast } from "@/lib/context/ToastContext";
import { useAuth } from "@/lib/context/AuthContext";
import Badge from "@/components/ui/Badge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { PageSkeleton } from "@/components/ui/LoadingSkeleton";
import { ChevronLeft, Plus, Pencil, Trash2, Gift, X, ImageIcon } from "lucide-react";
import { format } from "date-fns";

interface ClientProfile {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  postal: string | null;
  preferences: string;
  specialDates: Array<{ id: string; label: string; month: number; day: number }>;
  orders: Array<{
    id: string;
    orderNumber: string;
    totalPrice: number;
    paymentStatus: string;
    deliveryDate: string;
    lineItems: Array<{ arrangementType: string | null }>;
  }>;
  photos: Array<{
    id: string;
    storageUrl: string;
    caption: string | null;
    createdAt: string;
  }>;
  subscriptions: Array<{
    id: string;
    frequency: string;
    arrangementType: string | null;
    price: number;
    status: string;
    nextOrderDate: string | null;
    deliveryMethod: string;
  }>;
  clientNotes: Array<{
    id: string;
    body: string;
    createdAt: string;
    createdBy: string | null;
  }>;
  relationshipsA: Array<{
    id: string;
    relationshipType: string;
    relatedClient: { id: string; name: string };
  }>;
  relationshipsB: Array<{
    id: string;
    relationshipType: string;
    client: { id: string; name: string };
  }>;
}

export default function ClientProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDate, setShowDeleteDate] = useState<string | null>(null);
  const [newNote, setNewNote] = useState("");
  const [newDateLabel, setNewDateLabel] = useState("");
  const [newDateMonth, setNewDateMonth] = useState("");
  const [newDateDay, setNewDateDay] = useState("");
  const [showAddDate, setShowAddDate] = useState(false);
  const [newPref, setNewPref] = useState("");
  const { addToast } = useToast();
  const { isOwner } = useAuth();

  const fetchClient = () => {
    setLoading(true);
    fetch(`/api/clients/${id}`)
      .then((r) => r.json())
      .then((data) => setClient(data))
      .catch(() => addToast("error", "Failed to load client"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchClient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const addNote = async () => {
    if (!newNote.trim()) return;
    const res = await fetch(`/api/clients/${id}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: newNote }),
    });
    if (res.ok) {
      setNewNote("");
      fetchClient();
      addToast("success", "Note added");
    }
  };

  const addSpecialDate = async () => {
    if (!newDateLabel || !newDateMonth || !newDateDay) return;
    const res = await fetch(`/api/clients/${id}/special-dates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        label: newDateLabel,
        month: parseInt(newDateMonth),
        day: parseInt(newDateDay),
      }),
    });
    if (res.ok) {
      setNewDateLabel("");
      setNewDateMonth("");
      setNewDateDay("");
      setShowAddDate(false);
      fetchClient();
      addToast("success", "Special date added");
    }
  };

  const deleteSpecialDate = async (dateId: string) => {
    const res = await fetch(
      `/api/clients/${id}/special-dates?dateId=${dateId}`,
      { method: "DELETE" }
    );
    if (res.ok) {
      fetchClient();
      addToast("success", "Date removed");
    }
  };

  const addPreference = async () => {
    if (!newPref.trim() || !client) return;
    const prefs = JSON.parse(client.preferences || "[]");
    prefs.push(newPref.trim());
    const res = await fetch(`/api/clients/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preferences: prefs }),
    });
    if (res.ok) {
      setNewPref("");
      fetchClient();
      addToast("success", "Preference added");
    }
  };

  const removePreference = async (pref: string) => {
    if (!client) return;
    const prefs = JSON.parse(client.preferences || "[]").filter(
      (p: string) => p !== pref
    );
    const res = await fetch(`/api/clients/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preferences: prefs }),
    });
    if (res.ok) {
      fetchClient();
    }
  };

  const handleSubAction = async (subId: string, action: string) => {
    const res = await fetch(`/api/subscriptions/${subId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: action }),
    });
    if (res.ok) {
      fetchClient();
      addToast("success", `Subscription ${action}`);
    }
  };

  if (loading) return <PageSkeleton />;
  if (!client)
    return <p className="text-sm text-neutral-400">Client not found</p>;

  const preferences: string[] = (() => {
    try {
      return JSON.parse(client.preferences || "[]");
    } catch {
      return [];
    }
  })();

  const allRelationships = [
    ...client.relationshipsA.map((r) => ({
      id: r.id,
      name: r.relatedClient.name,
      clientId: r.relatedClient.id,
      type: r.relationshipType,
    })),
    ...client.relationshipsB.map((r) => ({
      id: r.id,
      name: r.client.name,
      clientId: r.client.id,
      type: r.relationshipType,
    })),
  ];

  const activeSub = client.subscriptions.find(
    (s) => s.status === "active" || s.status === "paused"
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/customers"
          className="text-sm text-neutral-400 hover:text-neutral-600 flex items-center gap-1 mb-3"
        >
          <ChevronLeft className="w-4 h-4" /> Customers
        </Link>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-brand-accent text-brand-primary flex items-center justify-center font-bold text-xl">
              {client.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold">{client.name}</h2>
              <div className="flex flex-wrap gap-3 text-sm text-neutral-600 mt-1">
                {client.phone && <span>{client.phone}</span>}
                {client.email && <span>{client.email}</span>}
                {client.address && <span>{client.address}</span>}
              </div>
              {client.specialDates.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {client.specialDates.map((d) => (
                    <span
                      key={d.id}
                      className="bg-brand-accent text-brand-primary text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                    >
                      <Gift className="w-3 h-3" />
                      {d.label}: {d.month}/{d.day}
                      {isOwner && (
                        <button
                          onClick={() => setShowDeleteDate(d.id)}
                          className="ml-1 hover:text-danger"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              )}
              {showAddDate ? (
                <div className="flex items-center gap-2 mt-2">
                  <input
                    value={newDateLabel}
                    onChange={(e) => setNewDateLabel(e.target.value)}
                    placeholder="Label"
                    className="border border-neutral-200 rounded-md px-2 py-1 text-sm w-24"
                  />
                  <input
                    value={newDateMonth}
                    onChange={(e) => setNewDateMonth(e.target.value)}
                    placeholder="Month"
                    type="number"
                    min={1}
                    max={12}
                    className="border border-neutral-200 rounded-md px-2 py-1 text-sm w-16"
                  />
                  <input
                    value={newDateDay}
                    onChange={(e) => setNewDateDay(e.target.value)}
                    placeholder="Day"
                    type="number"
                    min={1}
                    max={31}
                    className="border border-neutral-200 rounded-md px-2 py-1 text-sm w-16"
                  />
                  <button onClick={addSpecialDate} className="text-brand-primary text-sm font-semibold">
                    Save
                  </button>
                  <button onClick={() => setShowAddDate(false)} className="text-neutral-400 text-sm">
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddDate(true)}
                  className="text-xs text-brand-primary hover:underline mt-2 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Date
                </button>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/customers/${id}`}
              className="border border-brand-primary text-brand-primary hover:bg-brand-accent text-sm font-semibold px-3 py-1.5 rounded-md flex items-center gap-1"
            >
              <Pencil className="w-4 h-4" /> Edit
            </Link>
            <Link
              href={`/orders/new?clientId=${id}`}
              className="bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-semibold px-3 py-1.5 rounded-md flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> New Order
            </Link>
          </div>
        </div>
      </div>

      {/* Grid panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Relationships */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4">
          <h3 className="text-base font-semibold mb-3">Relationships</h3>
          {allRelationships.length === 0 ? (
            <p className="text-sm text-neutral-400">No relationships</p>
          ) : (
            <div className="space-y-2">
              {allRelationships.map((r) => (
                <Link
                  key={r.id}
                  href={`/customers/${r.clientId}`}
                  className="flex items-center gap-2 text-sm hover:text-brand-primary"
                >
                  <span className="font-medium">{r.name}</span>
                  <span className="text-neutral-400">- {r.type}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Order History */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4">
          <h3 className="text-base font-semibold mb-3">Order History</h3>
          {client.orders.length === 0 ? (
            <p className="text-sm text-neutral-400">No orders yet</p>
          ) : (
            <div className="space-y-2">
              {client.orders.slice(0, 5).map((o) => {
                const arrangementSummary = o.lineItems?.map(li => li.arrangementType).filter(Boolean).join(", ");
                return (
                  <Link key={o.id} href={`/orders/${o.id}`} className="flex items-center justify-between text-sm hover:bg-neutral-50 -mx-1 px-1 rounded">
                    <div>
                      <span className="text-neutral-400">
                        {format(new Date(o.deliveryDate), "MMM d")}
                      </span>
                      <span className="ml-2 font-medium">{o.orderNumber}</span>
                      {arrangementSummary && (
                        <span className="ml-2 text-neutral-400">
                          {arrangementSummary}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">${o.totalPrice.toFixed(2)}</span>
                      <Badge variant={o.paymentStatus as "paid" | "unpaid" | "partial"}>
                        {o.paymentStatus}
                      </Badge>
                    </div>
                  </Link>
                );
              })}
              {client.orders.length > 5 && (
                <Link
                  href={`/orders?clientId=${id}`}
                  className="text-sm text-brand-primary hover:underline"
                >
                  View all orders
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-lg border border-neutral-200 p-4 mb-6">
        <h3 className="text-base font-semibold mb-3">Preferences</h3>
        <div className="flex flex-wrap gap-2">
          {preferences.map((p, i) => (
            <span
              key={i}
              className="bg-brand-accent text-brand-primary text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
            >
              {p}
              <button
                onClick={() => removePreference(p)}
                className="hover:text-danger"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <div className="flex items-center gap-1">
            <input
              value={newPref}
              onChange={(e) => setNewPref(e.target.value)}
              placeholder="Add..."
              className="border border-neutral-200 rounded-md px-2 py-0.5 text-xs w-24"
              onKeyDown={(e) => e.key === "Enter" && addPreference()}
            />
            <button
              onClick={addPreference}
              className="text-brand-primary"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-lg border border-neutral-200 p-4 mb-6">
        <h3 className="text-base font-semibold mb-3">Notes</h3>
        <div className="flex gap-2 mb-3">
          <input
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note..."
            className="flex-1 border border-neutral-200 rounded-md px-3 py-2 text-sm"
            onKeyDown={(e) => e.key === "Enter" && addNote()}
          />
          <button
            onClick={addNote}
            className="bg-brand-primary hover:bg-brand-primary-hover text-white text-sm px-3 py-2 rounded-md"
          >
            Add
          </button>
        </div>
        {client.clientNotes.length === 0 ? (
          <p className="text-sm text-neutral-400">No notes yet</p>
        ) : (
          <div className="space-y-2">
            {client.clientNotes.map((n) => (
              <div key={n.id} className="text-sm">
                <span className="text-neutral-400 text-xs">
                  {format(new Date(n.createdAt), "MMM d, yyyy")}
                </span>
                <p>{n.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reference Photos */}
      <div className="bg-white rounded-lg border border-neutral-200 p-4 mb-6">
        <h3 className="text-base font-semibold mb-3">Reference Photos</h3>
        <p className="text-xs text-neutral-400 mb-3">Past order photos, style preferences, color palettes, and arrangement examples.</p>
        {client.photos && client.photos.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {client.photos.map((photo) => (
              <div key={photo.id} className="relative group">
                <div className="aspect-square rounded-lg bg-neutral-100 border border-neutral-200 overflow-hidden">
                  <img
                    src={photo.storageUrl}
                    alt={photo.caption || "Reference photo"}
                    className="w-full h-full object-cover"
                  />
                </div>
                {photo.caption && (
                  <p className="text-xs text-neutral-500 mt-1 truncate">{photo.caption}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-neutral-400">
            <ImageIcon className="w-8 h-8 mb-2" />
            <p className="text-sm">No reference photos yet</p>
          </div>
        )}
      </div>

      {/* Subscription */}
      <div className="bg-white rounded-lg border border-neutral-200 p-4">
        <h3 className="text-base font-semibold mb-3">Subscription</h3>
        {activeSub ? (
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm capitalize">{activeSub.frequency}</span>
              {activeSub.arrangementType && (
                <span className="text-sm text-neutral-600">
                  {activeSub.arrangementType}
                </span>
              )}
              <span className="text-sm text-neutral-600 capitalize">
                {activeSub.deliveryMethod}
              </span>
              <span className="text-sm font-medium">
                ${activeSub.price.toFixed(2)}
              </span>
              {activeSub.nextOrderDate && (
                <span className="text-sm text-neutral-400">
                  Next: {format(new Date(activeSub.nextOrderDate), "MMM d")}
                </span>
              )}
              <Badge variant={activeSub.status as "active" | "paused"}>
                {activeSub.status}
              </Badge>
            </div>
            <div className="flex gap-2">
              {activeSub.status === "active" && (
                <button
                  onClick={() => handleSubAction(activeSub.id, "paused")}
                  className="text-sm text-neutral-600 hover:bg-neutral-100 px-3 py-1 rounded-md border border-neutral-200"
                >
                  Pause
                </button>
              )}
              {activeSub.status === "paused" && (
                <button
                  onClick={() => handleSubAction(activeSub.id, "active")}
                  className="text-sm text-brand-primary hover:bg-brand-accent px-3 py-1 rounded-md border border-brand-primary"
                >
                  Resume
                </button>
              )}
              <button
                onClick={() => handleSubAction(activeSub.id, "cancelled")}
                className="text-sm text-danger hover:bg-red-50 px-3 py-1 rounded-md border border-red-200"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-neutral-400">No active subscription</p>
        )}
      </div>

      <ConfirmDialog
        open={!!showDeleteDate}
        onClose={() => setShowDeleteDate(null)}
        onConfirm={() => showDeleteDate && deleteSpecialDate(showDeleteDate)}
        title="Delete Special Date"
        message="Are you sure you want to remove this special date?"
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}
