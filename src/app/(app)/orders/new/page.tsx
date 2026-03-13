"use client";

import { useState, useEffect, Suspense, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/lib/context/ToastContext";
import { useSettings } from "@/lib/context/SettingsContext";
import { Plus, X, AlertTriangle, ArrowLeft } from "lucide-react";

interface FlowerRow {
  variety: string;
  color: string;
  qty: number;
}

interface LineItem {
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

function createEmptyLineItem(): LineItem {
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
  };
}

export default function NewOrderPage() {
  return (
    <Suspense fallback={<div className="p-6 text-neutral-400">Loading...</div>}>
      <NewOrderContent />
    </Suspense>
  );
}

function NewOrderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const { settings } = useSettings();
  const threshold = parseFloat(settings.large_order_threshold) || 200;

  // Order-level state
  const [locationType, setLocationType] = useState<"Indoor" | "Outdoor">("Indoor");
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [clientSearch, setClientSearch] = useState("");
  const [clientId, setClientId] = useState("");
  const [selectedClient, setSelectedClient] = useState<ClientOption | null>(null);
  const [sameAsClient, setSameAsClient] = useState(true);
  const [recipientName, setRecipientName] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [occasion, setOccasion] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTimeWindow, setDeliveryTimeWindow] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [status, setStatus] = useState("confirmed");
  const [paymentStatus, setPaymentStatus] = useState("unpaid");
  const [internalNotes, setInternalNotes] = useState("");
  const [saving, setSaving] = useState(false);

  // Line items
  const [lineItems, setLineItems] = useState<LineItem[]>([createEmptyLineItem()]);

  // Load clients
  useEffect(() => {
    fetch("/api/clients")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setClients(data);
      })
      .catch(() => {});
  }, []);

  // Pre-fill client from query param
  useEffect(() => {
    const paramClientId = searchParams.get("clientId");
    if (paramClientId && clients.length > 0) {
      const match = clients.find((c) => c.id === paramClientId);
      if (match) {
        setClientId(match.id);
        setSelectedClient(match);
        setClientSearch(match.name);
      }
    }
  }, [searchParams, clients]);

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
  const addLineItem = () => {
    setLineItems((prev) => [...prev, createEmptyLineItem()]);
  };

  const removeLineItem = (idx: number) => {
    setLineItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateLineItem = (idx: number, updates: Partial<LineItem>) => {
    setLineItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, ...updates } : item))
    );
  };

  const addFlowerRow = (itemIdx: number) => {
    setLineItems((prev) =>
      prev.map((item, i) =>
        i === itemIdx
          ? { ...item, flowers: [...item.flowers, { variety: "", color: "", qty: 1 }] }
          : item
      )
    );
  };

  const removeFlowerRow = (itemIdx: number, flowerIdx: number) => {
    setLineItems((prev) =>
      prev.map((item, i) =>
        i === itemIdx
          ? { ...item, flowers: item.flowers.filter((_, fi) => fi !== flowerIdx) }
          : item
      )
    );
  };

  const updateFlowerRow = (
    itemIdx: number,
    flowerIdx: number,
    field: keyof FlowerRow,
    val: string | number
  ) => {
    setLineItems((prev) =>
      prev.map((item, i) =>
        i === itemIdx
          ? {
              ...item,
              flowers: item.flowers.map((row, fi) =>
                fi === flowerIdx ? { ...row, [field]: val } : row
              ),
            }
          : item
      )
    );
  };

  const runningTotal = lineItems.reduce((sum, item) => sum + item.price, 0);

  const preferences = selectedClient
    ? (() => {
        try {
          return JSON.parse(selectedClient.preferences);
        } catch {
          return [];
        }
      })()
    : [];

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!clientId || !deliveryDate || !locationType) {
      addToast("error", "Client, delivery date, and location type are required");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          recipientName: sameAsClient ? null : recipientName,
          recipientAddress: sameAsClient ? null : recipientAddress,
          occasion,
          locationType,
          paymentStatus,
          deliveryDate,
          deliveryTimeWindow,
          deliveryMethod,
          deliveryAddress: deliveryMethod === "delivery" ? deliveryAddress : null,
          internalNotes,
          status,
          lineItems: lineItems.map((item, idx) => ({
            arrangementType: item.arrangementType,
            description: item.description,
            flowers: item.flowers.filter((f) => f.variety),
            vaseOption:
              item.arrangementType === "Vase Arrangement" ? item.vaseOption : null,
            vaseDescription:
              item.arrangementType === "Vase Arrangement" && item.vaseOption === "Our Vase"
                ? item.vaseDescription
                : null,
            wrapOption:
              item.arrangementType === "Bouquet" ? item.wrapOption : null,
            cardRequired: item.cardRequired,
            cardMessage: item.cardRequired ? item.cardMessage : null,
            specialInstructions: item.specialInstructions,
            price: item.price,
            sortOrder: idx,
          })),
        }),
      });

      if (res.ok) {
        addToast("success", "Order created successfully");
        router.push("/orders");
      } else {
        const data = await res.json();
        addToast("error", data.error?.toString() || "Failed to create order");
      }
    } catch {
      addToast("error", "Network error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/orders"
          className="text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-semibold text-neutral-900">New Order</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── ORDER-LEVEL FIELDS ── */}
        <div className="bg-white border border-neutral-200 rounded-lg p-5 space-y-4">
          <h2 className="text-sm font-semibold text-neutral-900 mb-2">Order Details</h2>

          {/* Location Type */}
          <div>
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
              Location Type <span className="text-danger">*</span>
            </label>
            <div className="flex gap-1 mt-1">
              <button
                type="button"
                onClick={() => setLocationType("Indoor")}
                className={`px-4 py-2 text-sm font-semibold rounded-l-md border transition-colors ${
                  locationType === "Indoor"
                    ? "bg-brand-primary text-white border-brand-primary"
                    : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
                }`}
              >
                Indoor
              </button>
              <button
                type="button"
                onClick={() => setLocationType("Outdoor")}
                className={`px-4 py-2 text-sm font-semibold rounded-r-md border transition-colors ${
                  locationType === "Outdoor"
                    ? "bg-brand-primary text-white border-brand-primary"
                    : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
                }`}
              >
                Outdoor
              </button>
            </div>
          </div>

          {/* Client selector */}
          <div>
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
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

          {/* Client preferences */}
          {selectedClient && preferences.length > 0 && (
            <div className="bg-brand-accent/50 rounded-md p-3">
              <p className="text-xs font-semibold text-neutral-600 mb-1">Preferences:</p>
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
          <div>
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
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
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Recipient name"
                  className="border border-neutral-200 rounded-md px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  placeholder="Recipient address"
                  className="border border-neutral-200 rounded-md px-3 py-2 text-sm"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Occasion */}
            <div>
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
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

            {/* Status */}
            <div>
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
              >
                {["draft", "confirmed", "in_progress", "ready", "delivered", "cancelled"].map(
                  (s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Delivery Date */}
            <div>
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
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

            {/* Time Window */}
            <div>
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
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
                    if (e.target.value) setDeliveryTimeWindow(e.target.value);
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
          </div>

          {/* Delivery Method */}
          <div>
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
              Delivery Method
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
            {deliveryMethod === "delivery" && (
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Delivery address"
                className="w-full mt-2 border border-neutral-200 rounded-md px-3 py-2 text-sm"
              />
            )}
          </div>

          {/* Payment Status */}
          <div>
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
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

          {/* Internal Notes */}
          <div>
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
              Internal Notes
            </label>
            <textarea
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
              rows={2}
            />
          </div>
        </div>

        {/* ── LINE ITEMS ── */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-neutral-900">Line Items</h2>

          {lineItems.map((item, itemIdx) => (
            <div
              key={itemIdx}
              className="bg-white border border-neutral-200 rounded-lg p-5 space-y-4 relative"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-neutral-700">
                  Item {itemIdx + 1}
                </h3>
                {lineItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLineItem(itemIdx)}
                    className="text-neutral-400 hover:text-danger transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Arrangement Type */}
                <div>
                  <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
                    Arrangement Type
                  </label>
                  <select
                    value={item.arrangementType}
                    onChange={(e) =>
                      updateLineItem(itemIdx, {
                        arrangementType: e.target.value,
                        vaseOption: "",
                        vaseDescription: "",
                        wrapOption: "",
                      })
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

                {/* Price */}
                <div>
                  <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
                    Unit Price
                  </label>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) =>
                      updateLineItem(itemIdx, {
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    min={0}
                    step={0.01}
                    className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
                  Description
                </label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) =>
                    updateLineItem(itemIdx, { description: e.target.value })
                  }
                  placeholder="Describe this arrangement..."
                  className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
                />
              </div>

              {/* Flowers */}
              <div>
                <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
                  Flowers
                </label>
                <div className="space-y-2 mt-1">
                  {item.flowers.map((row, flowerIdx) => (
                    <div key={flowerIdx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={row.variety}
                        onChange={(e) =>
                          updateFlowerRow(itemIdx, flowerIdx, "variety", e.target.value)
                        }
                        placeholder="Variety"
                        className="flex-1 border border-neutral-200 rounded-md px-3 py-2 text-sm"
                      />
                      <input
                        type="text"
                        value={row.color}
                        onChange={(e) =>
                          updateFlowerRow(itemIdx, flowerIdx, "color", e.target.value)
                        }
                        placeholder="Color"
                        className="w-24 border border-neutral-200 rounded-md px-3 py-2 text-sm"
                      />
                      <input
                        type="number"
                        value={row.qty}
                        onChange={(e) =>
                          updateFlowerRow(
                            itemIdx,
                            flowerIdx,
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
                          onClick={() => removeFlowerRow(itemIdx, flowerIdx)}
                          className="text-neutral-400 hover:text-danger"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addFlowerRow(itemIdx)}
                    className="text-sm text-brand-primary hover:text-brand-primary-hover flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add flower
                  </button>
                </div>
              </div>

              {/* Conditional: Vase Option (Vase Arrangement only) */}
              {item.arrangementType === "Vase Arrangement" && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
                    Vase Option
                  </label>
                  <div className="flex gap-4">
                    {["Our Vase", "Their Vase", "No Vase"].map((opt) => (
                      <label key={opt} className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name={`vaseOption-${itemIdx}`}
                          checked={item.vaseOption === opt}
                          onChange={() =>
                            updateLineItem(itemIdx, { vaseOption: opt })
                          }
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                  {item.vaseOption === "Our Vase" && (
                    <input
                      type="text"
                      value={item.vaseDescription}
                      onChange={(e) =>
                        updateLineItem(itemIdx, { vaseDescription: e.target.value })
                      }
                      placeholder="Vase description (size, style, etc.)"
                      className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
                    />
                  )}
                </div>
              )}

              {/* Conditional: Wrap Option (Bouquet only) */}
              {item.arrangementType === "Bouquet" && (
                <div>
                  <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
                    Wrap Option
                  </label>
                  <div className="flex gap-4 mt-1">
                    {["Normal Wrap", "Gift Wrap", "Wet Pack", "None"].map((opt) => (
                      <label key={opt} className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name={`wrapOption-${itemIdx}`}
                          checked={item.wrapOption === opt}
                          onChange={() =>
                            updateLineItem(itemIdx, { wrapOption: opt })
                          }
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Card */}
              <div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={item.cardRequired}
                    onChange={(e) =>
                      updateLineItem(itemIdx, { cardRequired: e.target.checked })
                    }
                  />
                  Card Required
                </label>
                {item.cardRequired && (
                  <textarea
                    value={item.cardMessage}
                    onChange={(e) =>
                      updateLineItem(itemIdx, { cardMessage: e.target.value })
                    }
                    placeholder="Card message..."
                    className="w-full mt-2 border border-neutral-200 rounded-md px-3 py-2 text-sm"
                    rows={2}
                  />
                )}
              </div>

              {/* Special Instructions */}
              <div>
                <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
                  Special Instructions
                </label>
                <textarea
                  value={item.specialInstructions}
                  onChange={(e) =>
                    updateLineItem(itemIdx, { specialInstructions: e.target.value })
                  }
                  className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
                  rows={2}
                />
              </div>
            </div>
          ))}

          {/* Add Item button */}
          <button
            type="button"
            onClick={addLineItem}
            className="w-full border-2 border-dashed border-neutral-300 rounded-lg py-3 text-sm font-semibold text-neutral-500 hover:border-brand-primary hover:text-brand-primary transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>

        {/* ── RUNNING TOTAL + WARNING ── */}
        <div className="bg-white border border-neutral-200 rounded-lg p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-neutral-700">Order Total</span>
            <span className="text-lg font-semibold text-neutral-900">
              ${runningTotal.toFixed(2)}
            </span>
          </div>

          {runningTotal > threshold && (
            <div className="bg-warning-bg border border-warning-border rounded-md px-3 py-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
              <span className="text-sm text-neutral-900">
                Large order (over ${threshold.toFixed(0)}) - consider adding handling notes
              </span>
            </div>
          )}
        </div>

        {/* ── SAVE ── */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-semibold px-6 py-2.5 rounded-md disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : "Save Order"}
          </button>
        </div>
      </form>
    </div>
  );
}
