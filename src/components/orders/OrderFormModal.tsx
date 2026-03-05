"use client";

import { useState, useEffect, type FormEvent } from "react";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/lib/context/ToastContext";
import { useSettings } from "@/lib/context/SettingsContext";
import { AlertTriangle, Plus, X } from "lucide-react";

interface FlowerRow {
  variety: string;
  color: string;
  qty: number;
}

interface ClientOption {
  id: string;
  name: string;
  phone: string | null;
  preferences: string;
}

interface OrderFormModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  initialClientId?: string;
  duplicateFrom?: Record<string, unknown>;
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

export default function OrderFormModal({
  open,
  onClose,
  onSaved,
  initialClientId,
  duplicateFrom,
}: OrderFormModalProps) {
  const { addToast } = useToast();
  const { settings } = useSettings();
  const threshold = parseFloat(settings.large_order_threshold) || 200;

  const [clients, setClients] = useState<ClientOption[]>([]);
  const [clientSearch, setClientSearch] = useState("");
  const [clientId, setClientId] = useState(initialClientId || "");
  const [selectedClient, setSelectedClient] = useState<ClientOption | null>(null);
  const [sameAsClient, setSameAsClient] = useState(true);
  const [recipientName, setRecipientName] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [occasion, setOccasion] = useState("");
  const [arrangementType, setArrangementType] = useState("");
  const [flowers, setFlowers] = useState<FlowerRow[]>([{ variety: "", color: "", qty: 1 }]);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [cardRequired, setCardRequired] = useState(false);
  const [cardMessage, setCardMessage] = useState("");
  const [price, setPrice] = useState(0);
  const [itemCount, setItemCount] = useState(1);
  const [paymentStatus, setPaymentStatus] = useState("unpaid");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTimeWindow, setDeliveryTimeWindow] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [status, setStatus] = useState("confirmed");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      fetch("/api/clients")
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setClients(data);
        })
        .catch(() => {});
    }
  }, [open]);

  useEffect(() => {
    if (duplicateFrom) {
      const d = duplicateFrom;
      setClientId((d.clientId as string) || "");
      setRecipientName((d.recipientName as string) || "");
      setRecipientAddress((d.recipientAddress as string) || "");
      setOccasion((d.occasion as string) || "");
      setArrangementType((d.arrangementType as string) || "");
      setSpecialInstructions((d.specialInstructions as string) || "");
      setCardRequired(!!d.cardRequired);
      setCardMessage((d.cardMessage as string) || "");
      setPrice((d.price as number) || 0);
      setItemCount((d.itemCount as number) || 1);
      setDeliveryMethod((d.deliveryMethod as string) || "delivery");
      setDeliveryAddress((d.deliveryAddress as string) || "");
      setInternalNotes((d.internalNotes as string) || "");
      if (d.flowers) {
        try {
          const f = typeof d.flowers === "string" ? JSON.parse(d.flowers) : d.flowers;
          if (Array.isArray(f)) setFlowers(f);
        } catch { /* ignore */ }
      }
      // Don't copy date or payment status for duplicates
      setDeliveryDate("");
      setPaymentStatus("unpaid");
    }
  }, [duplicateFrom]);

  useEffect(() => {
    if (initialClientId) setClientId(initialClientId);
  }, [initialClientId]);

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

  const addFlowerRow = () =>
    setFlowers((prev) => [...prev, { variety: "", color: "", qty: 1 }]);

  const removeFlowerRow = (idx: number) =>
    setFlowers((prev) => prev.filter((_, i) => i !== idx));

  const updateFlowerRow = (idx: number, field: keyof FlowerRow, val: string | number) =>
    setFlowers((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, [field]: val } : r))
    );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!clientId || !deliveryDate) {
      addToast("error", "Client and delivery date are required");
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
          arrangementType,
          flowers: flowers.filter((f) => f.variety),
          specialInstructions,
          cardRequired,
          cardMessage: cardRequired ? cardMessage : null,
          price,
          itemCount,
          paymentStatus,
          deliveryDate,
          deliveryTimeWindow,
          deliveryMethod,
          deliveryAddress:
            deliveryMethod === "delivery" ? deliveryAddress : null,
          internalNotes,
          status,
        }),
      });

      if (res.ok) {
        addToast("success", "Order created successfully");
        onSaved();
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

  const preferences = selectedClient
    ? (() => {
        try {
          return JSON.parse(selectedClient.preferences);
        } catch {
          return [];
        }
      })()
    : [];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New Order"
      footer={
        <>
          <button
            onClick={onClose}
            className="border border-neutral-200 text-neutral-600 hover:bg-neutral-100 text-sm font-semibold px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={(e) => handleSubmit(e as unknown as FormEvent)}
            disabled={saving}
            className="bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-semibold px-4 py-2 rounded-md disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Order"}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
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

        {/* Client suggestions */}
        {selectedClient && preferences.length > 0 && (
          <div className="bg-brand-accent/50 rounded-md p-3">
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
                placeholder="Name"
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

        <div className="grid grid-cols-2 gap-4">
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
          <div>
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
              Arrangement Type
            </label>
            <select
              value={arrangementType}
              onChange={(e) => setArrangementType(e.target.value)}
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
        </div>

        <div className="grid grid-cols-2 gap-4">
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

        {/* Delivery method */}
        <div>
          <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
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

        {/* Flowers */}
        <div>
          <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
            Flowers
          </label>
          <div className="space-y-2 mt-1">
            {flowers.map((row, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={row.variety}
                  onChange={(e) => updateFlowerRow(idx, "variety", e.target.value)}
                  placeholder="Variety"
                  className="flex-1 border border-neutral-200 rounded-md px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  value={row.color}
                  onChange={(e) => updateFlowerRow(idx, "color", e.target.value)}
                  placeholder="Color"
                  className="w-24 border border-neutral-200 rounded-md px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  value={row.qty}
                  onChange={(e) => updateFlowerRow(idx, "qty", parseInt(e.target.value) || 1)}
                  min={1}
                  className="w-16 border border-neutral-200 rounded-md px-3 py-2 text-sm"
                />
                {flowers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFlowerRow(idx)}
                    className="text-neutral-400 hover:text-danger"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addFlowerRow}
              className="text-sm text-brand-primary hover:text-brand-primary-hover flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add flower
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
            Special Instructions
          </label>
          <textarea
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
            rows={2}
          />
        </div>

        {/* Card */}
        <div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={cardRequired}
              onChange={(e) => setCardRequired(e.target.checked)}
            />
            Card Required
          </label>
          {cardRequired && (
            <textarea
              value={cardMessage}
              onChange={(e) => setCardMessage(e.target.value)}
              placeholder="Card message..."
              className="w-full mt-2 border border-neutral-200 rounded-md px-3 py-2 text-sm"
              rows={2}
            />
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
              Price
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              min={0}
              step={0.01}
              className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
              Items
            </label>
            <input
              type="number"
              value={itemCount}
              onChange={(e) => setItemCount(parseInt(e.target.value) || 1)}
              min={1}
              className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
              Payment
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

        {price > threshold && (
          <div className="bg-warning-bg border border-warning-border rounded-md px-3 py-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            <span className="text-sm text-neutral-900">
              Large order - consider adding handling notes
            </span>
          </div>
        )}

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
      </form>
    </Modal>
  );
}
