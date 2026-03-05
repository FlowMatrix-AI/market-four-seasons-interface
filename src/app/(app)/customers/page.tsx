"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, Plus, X } from "lucide-react";
import { useToast } from "@/lib/context/ToastContext";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import { TableSkeleton } from "@/components/ui/LoadingSkeleton";
import { format } from "date-fns";

interface ClientData {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  orders: Array<{ deliveryDate: string }>;
  subscriptions: Array<{ status: string }>;
}

interface SubscriptionData {
  id: string;
  clientId: string;
  frequency: string;
  nextOrderDate: string | null;
  arrangementType: string | null;
  price: number;
  status: string;
  client: { id: string; name: string };
}

export default function CustomersPage() {
  const [tab, setTab] = useState<"all" | "subscriptions">("all");
  const [clients, setClients] = useState<ClientData[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const { addToast } = useToast();

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const url = query ? `/api/clients?q=${encodeURIComponent(query)}` : "/api/clients";
      const res = await fetch(url);
      if (res.ok) setClients(await res.json());
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const timer = setTimeout(fetchClients, 300);
    return () => clearTimeout(timer);
  }, [fetchClients]);

  useEffect(() => {
    if (tab === "subscriptions") {
      fetch("/api/subscriptions")
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setSubscriptions(data);
        })
        .catch(() => {});
    }
  }, [tab]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setTab("all")}
            className={`text-sm px-3 py-1 rounded-md ${tab === "all" ? "bg-brand-primary text-white font-semibold" : "text-neutral-600 hover:bg-neutral-100"}`}
          >
            All Clients
          </button>
          <button
            onClick={() => setTab("subscriptions")}
            className={`text-sm px-3 py-1 rounded-md ${tab === "subscriptions" ? "bg-brand-primary text-white font-semibold" : "text-neutral-600 hover:bg-neutral-100"}`}
          >
            Subscriptions
          </button>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-semibold px-3 py-1.5 rounded-md flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> New Client
        </button>
      </div>

      {tab === "all" && (
        <>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search clients..."
              className="pl-9 pr-9 py-2 border border-neutral-200 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {loading ? (
            <TableSkeleton />
          ) : clients.length === 0 ? (
            <div className="bg-white rounded-lg border border-neutral-200 p-8 text-center">
              <p className="text-sm text-neutral-400">
                {query ? "No clients match your search" : "No clients yet"}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-100 border-b border-neutral-200">
                  <th className="text-left text-xs font-semibold text-neutral-600 uppercase tracking-wide px-4 py-3">
                    Name
                  </th>
                  <th className="text-left text-xs font-semibold text-neutral-600 uppercase tracking-wide px-4 py-3">
                    Phone
                  </th>
                  <th className="text-left text-xs font-semibold text-neutral-600 uppercase tracking-wide px-4 py-3">
                    Last Order
                  </th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/customers/${c.id}`}
                        className="flex items-center gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-brand-accent text-brand-primary flex items-center justify-center font-semibold text-xs">
                          {c.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <span className="text-sm font-medium">{c.name}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600">
                      {c.phone || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600">
                      {c.orders[0]
                        ? format(new Date(c.orders[0].deliveryDate), "MMM d, yyyy")
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {tab === "subscriptions" && (
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-100 border-b border-neutral-200">
              <th className="text-left text-xs font-semibold text-neutral-600 uppercase tracking-wide px-4 py-3">
                Client
              </th>
              <th className="text-left text-xs font-semibold text-neutral-600 uppercase tracking-wide px-4 py-3">
                Frequency
              </th>
              <th className="text-left text-xs font-semibold text-neutral-600 uppercase tracking-wide px-4 py-3">
                Next Date
              </th>
              <th className="text-left text-xs font-semibold text-neutral-600 uppercase tracking-wide px-4 py-3">
                Price
              </th>
              <th className="text-left text-xs font-semibold text-neutral-600 uppercase tracking-wide px-4 py-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((s) => (
              <tr
                key={s.id}
                className="border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/customers/${s.client.id}`}
                    className="text-sm font-medium text-brand-primary hover:underline"
                  >
                    {s.client.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm capitalize">{s.frequency}</td>
                <td className="px-4 py-3 text-sm">
                  {s.nextOrderDate
                    ? format(new Date(s.nextOrderDate), "MMM d, yyyy")
                    : "-"}
                </td>
                <td className="px-4 py-3 text-sm">${s.price.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <Badge variant={s.status as "active" | "paused"}>
                    {s.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <CreateClientModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={() => {
          setShowCreate(false);
          fetchClients();
        }}
        addToast={addToast}
      />
    </div>
  );
}

function CreateClientModal({
  open,
  onClose,
  onCreated,
  addToast,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  addToast: (type: "success" | "error", msg: string) => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, address }),
      });
      if (res.ok) {
        addToast("success", "Client created");
        setName("");
        setPhone("");
        setEmail("");
        setAddress("");
        setError("");
        onCreated();
      } else {
        addToast("error", "Failed to create client");
      }
    } catch {
      addToast("error", "Network error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New Client"
      footer={
        <>
          <button
            onClick={onClose}
            className="border border-neutral-200 text-neutral-600 hover:bg-neutral-100 text-sm font-semibold px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-semibold px-4 py-2 rounded-md disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
            Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
          />
          {error && <p className="text-xs text-danger mt-1">{error}</p>}
        </div>
        <div>
          <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
            Phone
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
            Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
          />
        </div>
      </div>
    </Modal>
  );
}
