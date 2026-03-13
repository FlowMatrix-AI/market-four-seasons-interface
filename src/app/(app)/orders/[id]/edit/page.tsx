"use client";

import { useState, useEffect, use, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/context/ToastContext";
import { useSettings } from "@/lib/context/SettingsContext";
import { PageSkeleton } from "@/components/ui/LoadingSkeleton";
import { ChevronLeft, Plus, X, AlertTriangle } from "lucide-react";

interface FlowerRow {
  variety: string;
  color: string;
  qty: number;
}

interface LineItemForm {
  id?: string;
  arrangementType: string;
  description: string;
  flowers: FlowerRow[];
  vaseOption: string;
  vaseDescription: string;
  wrapOption: string;
  cardRequired: boolean;
  cardMessage: string;
  specialInstructions: string;
  price: number;
  sortOrder: number;
}

interface ClientOption {
  id: string;
  name: string;
  phone: string | null;
  preferences: string;
}

const OCCASIONS = [
  "Valentine's Day",
  "Birthday",
  "Anniversary",
  "Sympathy",
  "Corporate",
  "Just Because",
  "Other",
];

const ARRANGEMENT_TYPES = [
  "Vase Arrangement",
  "Bouquet",
  "Centerpiece",
  "Basket",
  "Planted Arrangement",
  "Wreath",
  "Other",
];

const TIME_PRESETS = ["AM", "10am-1pm", "1pm-5pm"];

function parseFlowers(json: string | null): FlowerRow[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function emptyLineItem(sortOrder: number): LineItemForm {
  return {
    arrangementType: "",
    description: "",
    flowers: [{ variety: "", color: "", qty: 1 }],
    vaseOption: "",
    vaseDescription: "",
    wrapOption: "",
    cardRequired: false,
    cardMessage: "",
    specialInstructions: "",
    price: 0,
    sortOrder,
  };
}

export default function OrderEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { addToast } = useToast();
  const { settings } = useSettings();
  const threshold = parseFloat(settings.large_order_threshold) || 200;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Order-level fields
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [clientSearch, setClientSearch] = useState("");
  const [clientId, setClientId] = useState("");
  const [selectedClient, setSelectedClient] = useState<ClientOption | null>(
    null
  );
  const [sameAsClient, setSameAsClient] = useState(true);
  const [recipientName, setRecipientName] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [occasion, setOccasion] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState("unpaid");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTimeWindow, setDeliveryTimeWindow] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [status, setStatus] = useState("confirmed");

  // Line items
  const [lineItems, setLineItems] = useState<LineItemForm[]>([
    emptyLineItem(0),
  ]);

  useEffect(() => {
    fetch("/api/clients")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setClients(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const loadOrder = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (!res.ok) {
          addToast("error", "Failed to load order");
          return;
        }
        const order = await res.json();

        setClientId(order.clientId);
        setClientSearch(order.client?.name || "");
        if (order.recipientName) {
          setSameAsClient(false);
          setRecipientName(order.recipientName);
          setRecipientAddress(order.recipientAddress || "");
          setRecipientPhone(order.recipientPhone || "");
        }
        setOccasion(order.occasion || "");
        setTotalPrice(order.totalPrice || 0);
        setPaymentStatus(order.paymentStatus || "unpaid");
        setDeliveryDate(
          order.deliveryDate
            ? order.deliveryDate.slice(0, 10)
            : ""
        );
        setDeliveryTimeWindow(order.deliveryTimeWindow || "");
        setDeliveryMethod(order.deliveryMethod || "delivery");
        setDeliveryAddress(order.deliveryAddress || "");
        setInternalNotes(order.internalNotes || "");
        setStatus(order.status || "confirmed");

        if (order.lineItems && order.lineItems.length > 0) {
          setLineItems(
            order.lineItems
              .sort(
                (a: { sortOrder: number }, b: { sortOrder: number }) =>
                  a.sortOrder - b.sortOrder
              )
              .map(
                (item: {
                  id: string;
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
                }) => ({
                  id: item.id,
                  arrangementType: item.arrangementType || "",
                  description: item.description || "",
                  flowers: parseFlowers(item.flowers),
                  vaseOption: item.vaseOption || "",
                  vaseDescription: item.vaseDescription || "",
                  wrapOption: item.wrapOption || "",
                  cardRequired: item.cardRequired,
                  cardMessage: item.cardMessage || "",
                  specialInstructions: item.specialInstructions || "",
                  price: item.price,
                  sortOrder: item.sortOrder,
                })
              )
          );
        }
      } catch {
        addToast("error", "Network error");
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
      (c.phone && c.phone.includes(clientSearch))
  );

  const selectClient = (c: ClientOption) => {
    setClientId(c.id);
    setSelectedClient(c);
    setClientSearch(c.name);
  };

  // Line item helpers
  const addLineItem = () =>
    setLineItems((prev) => [...prev, emptyLineItem(prev.length)]);

  const removeLineItem = (idx: number) =>
    setLineItems((prev) => prev.filter((_, i) => i !== idx));

  const updateLineItem = (
    idx: number,
    field: keyof LineItemForm,
    value: string | number | boolean | FlowerRow[]
  ) =>
    setLineItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );

  // Flower row helpers within a line item
  const addFlowerRow = (itemIdx: number) =>
    setLineItems((prev) =>
      prev.map((item, i) =>
        i === itemIdx
          ? {
              ...item,
              flowers: [...item.flowers, { variety: "", color: "", qty: 1 }],
            }
          : item
      )
    );

  const removeFlowerRow = (itemIdx: number, flowerIdx: number) =>
    setLineItems((prev) =>
      prev.map((item, i) =>
        i === itemIdx
          ? {
              ...item,
              flowers: item.flowers.filter((_, fi) => fi !== flowerIdx),
            }
          : item
      )
    );

  const updateFlowerRow = (
    itemIdx: number,
    flowerIdx: number,
    field: keyof FlowerRow,
    value: string | number
  ) =>
    setLineItems((prev) =>
      prev.map((item, i) =>
        i === itemIdx
          ? {
              ...item,
              flowers: item.flowers.map((f, fi) =>
                fi === flowerIdx ? { ...f, [field]: value } : f
              ),
            }
          : item
      )
    );

  const preferences = selectedClient
    ? (() => {
        try {
          return JSON.parse(selectedClient.preferences);
        } catch {
          return [];
        }
      })()
    : [];

  const computedTotal = lineItems.reduce((sum, item) => sum + item.price, 0);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!clientId || !deliveryDate) {
      addToast("error", "Client and delivery date are required");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          recipientName: sameAsClient ? null : recipientName,
          recipientAddress: sameAsClient ? null : recipientAddress,
          recipientPhone: sameAsClient ? null : recipientPhone,
          occasion,
          totalPrice: computedTotal > 0 ? computedTotal : totalPrice,
          paymentStatus,
          deliveryDate,
          deliveryTimeWindow,
          deliveryMethod,
          deliveryAddress:
            deliveryMethod === "delivery" ? deliveryAddress : null,
          internalNotes,
          status,
          lineItems: lineItems.map((item, idx) => ({
            id: item.id || undefined,
            arrangementType: item.arrangementType || null,
            description: item.description || null,
            flowers: item.flowers.filter((f) => f.variety),
            vaseOption: item.vaseOption || null,
            vaseDescription: item.vaseDescription || null,
            wrapOption: item.wrapOption || null,
            cardRequired: item.cardRequired,
            cardMessage: item.cardRequired ? item.cardMessage || null : null,
            specialInstructions: item.specialInstructions || null,
            price: item.price,
            sortOrder: idx,
          })),
        }),
      });

      if (res.ok) {
        addToast("success", "Order updated successfully");
        router.push(`/orders/${id}`);
      } else {
        const data = await res.json();
        addToast(
          "error",
          data.error?.toString() || "Failed to update order"
        );
      }
    } catch {
      addToast("error", "Network error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <PageSkeleton />;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href={`/orders/${id}`}
          className="text-sm text-neutral-400 hover:text-neutral-600 flex items-center gap-1 mb-3"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Order
        </Link>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Edit Order</h2>
          <div className="flex gap-2">
            <Link
              href={`/orders/${id}`}
              className="border border-neutral-200 text-neutral-600 hover:bg-neutral-100 text-sm font-semibold px-4 py-2 rounded-md"
            >
              Cancel
            </Link>
            <button
              onClick={(e) => handleSubmit(e as unknown as FormEvent)}
              disabled={saving}
              className="bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-semibold px-4 py-2 rounded-md disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Status & Payment */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4 shadow-sm">
          <h3 className="text-base font-semibold mb-3">Status & Payment</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
              >
                {[
                  "draft",
                  "confirmed",
                  "in_progress",
                  "ready",
                  "delivered",
                  "cancelled",
                ].map((s) => (
                  <option key={s} value={s}>
                    {s.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
              >
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
              </select>
            </div>
          </div>
        </div>

        {/* Client */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4 shadow-sm">
          <h3 className="text-base font-semibold mb-3">Client</h3>
          <div>
            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
              Client (Sender) <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={clientSearch}
              onChange={(e) => {
                setClientSearch(e.target.value);
                setClientId("");
                setSelectedClient(null);
              }}
              placeholder="Search clients..."
              className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
            />
            {clientSearch && !clientId && (
              <div className="border border-neutral-200 rounded-md mt-1 max-h-32 overflow-y-auto">
                {filteredClients.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => selectClient(c)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-50"
                  >
                    {c.name} {c.phone && `- ${c.phone}`}
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedClient && preferences.length > 0 && (
            <div className="bg-brand-accent/50 rounded-md p-3 mt-3">
              <p className="text-xs font-semibold text-neutral-600 mb-1">
                Preferences:
              </p>
              <div className="flex flex-wrap gap-1">
                {(preferences as string[]).map((p: string, i: number) => (
                  <span
                    key={i}
                    className="bg-white text-xs px-2 py-0.5 rounded-full border border-neutral-200"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recipient */}
          <div className="mt-4">
            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
              Recipient
            </label>
            <div className="flex gap-4 mt-1 mb-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={sameAsClient}
                  onChange={() => setSameAsClient(true)}
                />
                Same as client
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={!sameAsClient}
                  onChange={() => setSameAsClient(false)}
                />
                Different recipient
              </label>
            </div>
            {!sameAsClient && (
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Name"
                  className="border border-neutral-200 rounded-md px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  placeholder="Phone"
                  className="border border-neutral-200 rounded-md px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  placeholder="Address"
                  className="border border-neutral-200 rounded-md px-3 py-2 text-sm"
                />
              </div>
            )}
          </div>
        </div>

        {/* Delivery */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4 shadow-sm">
          <h3 className="text-base font-semibold mb-3">Delivery</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                Occasion
              </label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Select...</option>
                {OCCASIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                Delivery Date <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                Time Window
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={deliveryTimeWindow}
                  onChange={(e) => setDeliveryTimeWindow(e.target.value)}
                  placeholder="e.g. 10am-1pm"
                  className="flex-1 border border-neutral-200 rounded-md px-3 py-2 text-sm"
                />
                <select
                  onChange={(e) => {
                    if (e.target.value)
                      setDeliveryTimeWindow(e.target.value);
                  }}
                  className="border border-neutral-200 rounded-md px-2 py-2 text-sm"
                  value=""
                >
                  <option value="">Presets</option>
                  {TIME_PRESETS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                Method
              </label>
              <div className="flex gap-4 mt-1">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={deliveryMethod === "delivery"}
                    onChange={() => setDeliveryMethod("delivery")}
                  />
                  Delivery
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={deliveryMethod === "pickup"}
                    onChange={() => setDeliveryMethod("pickup")}
                  />
                  Pickup
                </label>
              </div>
            </div>
          </div>
          {deliveryMethod === "delivery" && (
            <div className="mt-4">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                Delivery Address
              </label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Delivery address"
                className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
              />
            </div>
          )}
        </div>

        {/* Line Items */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold">Line Items</h3>
            <button
              type="button"
              onClick={addLineItem}
              className="text-sm text-brand-primary hover:text-brand-primary-hover flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>

          <div className="space-y-6">
            {lineItems.map((item, idx) => (
              <div
                key={idx}
                className="border border-neutral-100 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                    Item {idx + 1}
                  </span>
                  {lineItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLineItem(idx)}
                      className="text-neutral-400 hover:text-danger"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                      Arrangement Type
                    </label>
                    <select
                      value={item.arrangementType}
                      onChange={(e) =>
                        updateLineItem(
                          idx,
                          "arrangementType",
                          e.target.value
                        )
                      }
                      className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
                    >
                      <option value="">Select...</option>
                      {ARRANGEMENT_TYPES.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                      Price
                    </label>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        updateLineItem(
                          idx,
                          "price",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      min={0}
                      step={0.01}
                      className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                    Description
                  </label>
                  <textarea
                    value={item.description}
                    onChange={(e) =>
                      updateLineItem(idx, "description", e.target.value)
                    }
                    className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
                    rows={2}
                  />
                </div>

                {/* Flowers */}
                <div className="mb-3">
                  <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                    Flowers
                  </label>
                  <div className="space-y-2 mt-1">
                    {item.flowers.map((flower, fi) => (
                      <div key={fi} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={flower.variety}
                          onChange={(e) =>
                            updateFlowerRow(
                              idx,
                              fi,
                              "variety",
                              e.target.value
                            )
                          }
                          placeholder="Variety"
                          className="flex-1 border border-neutral-200 rounded-md px-3 py-2 text-sm"
                        />
                        <input
                          type="text"
                          value={flower.color}
                          onChange={(e) =>
                            updateFlowerRow(
                              idx,
                              fi,
                              "color",
                              e.target.value
                            )
                          }
                          placeholder="Color"
                          className="w-24 border border-neutral-200 rounded-md px-3 py-2 text-sm"
                        />
                        <input
                          type="number"
                          value={flower.qty}
                          onChange={(e) =>
                            updateFlowerRow(
                              idx,
                              fi,
                              "qty",
                              parseInt(e.target.value) || 1
                            )
                          }
                          min={1}
                          className="w-16 border border-neutral-200 rounded-md px-3 py-2 text-sm"
                        />
                        {item.flowers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFlowerRow(idx, fi)}
                            className="text-neutral-400 hover:text-danger"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addFlowerRow(idx)}
                      className="text-sm text-brand-primary hover:text-brand-primary-hover flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add flower
                    </button>
                  </div>
                </div>

                {/* Vase / Wrap */}
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                      Vase Option
                    </label>
                    <select
                      value={item.vaseOption}
                      onChange={(e) =>
                        updateLineItem(idx, "vaseOption", e.target.value)
                      }
                      className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
                    >
                      <option value="">None</option>
                      <option value="standard">Standard</option>
                      <option value="premium">Premium</option>
                      <option value="client_provided">
                        Client Provided
                      </option>
                    </select>
                    {item.vaseOption && (
                      <input
                        type="text"
                        value={item.vaseDescription}
                        onChange={(e) =>
                          updateLineItem(
                            idx,
                            "vaseDescription",
                            e.target.value
                          )
                        }
                        placeholder="Vase details..."
                        className="w-full mt-2 border border-neutral-200 rounded-md px-3 py-2 text-sm"
                      />
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                      Wrap Option
                    </label>
                    <select
                      value={item.wrapOption}
                      onChange={(e) =>
                        updateLineItem(idx, "wrapOption", e.target.value)
                      }
                      className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
                    >
                      <option value="">None</option>
                      <option value="kraft">Kraft Paper</option>
                      <option value="tissue">Tissue Paper</option>
                      <option value="cellophane">Cellophane</option>
                      <option value="burlap">Burlap</option>
                    </select>
                  </div>
                </div>

                {/* Card */}
                <div className="mb-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={item.cardRequired}
                      onChange={(e) =>
                        updateLineItem(
                          idx,
                          "cardRequired",
                          e.target.checked
                        )
                      }
                    />
                    Card Required
                  </label>
                  {item.cardRequired && (
                    <textarea
                      value={item.cardMessage}
                      onChange={(e) =>
                        updateLineItem(
                          idx,
                          "cardMessage",
                          e.target.value
                        )
                      }
                      placeholder="Card message..."
                      className="w-full mt-2 border border-neutral-200 rounded-md px-3 py-2 text-sm"
                      rows={2}
                    />
                  )}
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                    Special Instructions
                  </label>
                  <textarea
                    value={item.specialInstructions}
                    onChange={(e) =>
                      updateLineItem(
                        idx,
                        "specialInstructions",
                        e.target.value
                      )
                    }
                    className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-4 pt-4 border-t border-neutral-200 flex items-center justify-between">
            <span className="text-sm font-semibold text-neutral-600">
              Computed Total
            </span>
            <span className="text-lg font-bold">
              ${computedTotal.toFixed(2)}
            </span>
          </div>

          {computedTotal > threshold && (
            <div className="bg-warning-bg border border-warning-border rounded-md px-3 py-2 flex items-center gap-2 mt-3">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-neutral-900">
                Large order - consider adding handling notes
              </span>
            </div>
          )}
        </div>

        {/* Internal Notes */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4 shadow-sm">
          <h3 className="text-base font-semibold mb-3">Internal Notes</h3>
          <textarea
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
            rows={3}
          />
        </div>

        {/* Bottom Save Bar */}
        <div className="flex justify-end gap-2 pt-2">
          <Link
            href={`/orders/${id}`}
            className="border border-neutral-200 text-neutral-600 hover:bg-neutral-100 text-sm font-semibold px-4 py-2 rounded-md"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-semibold px-4 py-2 rounded-md disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
