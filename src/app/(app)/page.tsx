"use client";

import { useState, useEffect, useCallback } from "react";
import { format, addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addWeeks, subWeeks, addMonths, subMonths, isSameDay, isToday, getDaysInMonth, getDay } from "date-fns";
import { ChevronLeft, ChevronRight, Plus, Printer } from "lucide-react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { sortByTimeWindow } from "@/lib/utils/sortOrders";
import { useSettings } from "@/lib/context/SettingsContext";

type ViewMode = "day" | "week" | "month";
type LocationFilter = "all" | "indoor" | "outdoor";

interface LineItemData {
  id: string;
  arrangementType: string | null;
  description: string | null;
  price: number;
}

interface OrderData {
  id: string;
  orderNumber: string;
  clientId: string;
  recipientName: string | null;
  recipientAddress: string | null;
  locationType: string;
  deliveryTimeWindow: string | null;
  deliveryMethod: string;
  deliveryAddress: string | null;
  paymentStatus: string;
  status: string;
  totalPrice: number;
  isSubscriptionGenerated: boolean;
  deliveryDate: string;
  client: { id: string; name: string };
  lineItems: LineItemData[];
}

interface Notification {
  id: string;
  type: string;
  message: string;
}

export default function CalendarPage() {
  const [view, setView] = useState<ViewMode>("day");
  const [date, setDate] = useState(new Date());
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showLargeOrderBanner, setShowLargeOrderBanner] = useState(true);
  const [showSubBanner, setShowSubBanner] = useState(true);
  const [locationFilter, setLocationFilter] = useState<LocationFilter>("all");
  const { settings } = useSettings();
  const threshold = parseFloat(settings.large_order_threshold) || 200;

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    let url = "";
    if (view === "day") {
      url = `/api/orders?date=${format(date, "yyyy-MM-dd")}`;
    } else if (view === "week") {
      const start = startOfWeek(date, { weekStartsOn: 0 });
      const end = endOfWeek(date, { weekStartsOn: 0 });
      url = `/api/orders?start=${format(start, "yyyy-MM-dd")}&end=${format(end, "yyyy-MM-dd")}`;
    } else {
      const start = startOfMonth(date);
      const end = endOfMonth(date);
      url = `/api/orders?start=${format(start, "yyyy-MM-dd")}&end=${format(end, "yyyy-MM-dd")}`;
    }
    if (locationFilter !== "all") {
      url += `&location=${locationFilter}`;
    }
    try {
      const res = await fetch(url);
      if (res.ok) setOrders(await res.json());
    } finally {
      setLoading(false);
    }
  }, [view, date, locationFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data) => setNotifications(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const navigate = (dir: number) => {
    if (view === "day") setDate((d) => (dir > 0 ? addDays(d, 1) : subDays(d, 1)));
    else if (view === "week") setDate((d) => (dir > 0 ? addWeeks(d, 1) : subWeeks(d, 1)));
    else setDate((d) => (dir > 0 ? addMonths(d, 1) : subMonths(d, 1)));
  };

  const largeOrders = orders.filter((o) => {
    const orderDate = new Date(o.deliveryDate);
    return o.totalPrice > threshold && isSameDay(orderDate, new Date());
  });

  const subNotifications = notifications.filter((n) => n.type === "subscription");

  const dismissSubBanner = async () => {
    setShowSubBanner(false);
    const ids = subNotifications.map((n) => n.id);
    if (ids.length) {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
    }
  };

  const dateLabel =
    view === "day"
      ? format(date, "MMMM d, yyyy")
      : view === "week"
        ? `${format(startOfWeek(date), "MMM d")} - ${format(endOfWeek(date), "MMM d, yyyy")}`
        : format(date, "MMMM yyyy");

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="text-neutral-600 hover:bg-neutral-100 p-1.5 rounded-md">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-base font-semibold min-w-48 text-center">{dateLabel}</span>
          <button onClick={() => navigate(1)} className="text-neutral-600 hover:bg-neutral-100 p-1.5 rounded-md">
            <ChevronRight className="w-5 h-5" />
          </button>
          <button onClick={() => setDate(new Date())} className="text-sm text-brand-primary hover:bg-brand-accent px-3 py-1 rounded-md ml-2">
            Today
          </button>
        </div>
        <div className="flex items-center gap-2">
          {(["day", "week", "month"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`text-sm px-3 py-1 rounded-md capitalize transition-colors ${
                view === v
                  ? "bg-brand-primary text-white font-semibold"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Location Filter */}
      <div className="flex items-center gap-2 mb-4">
        {(["all", "indoor", "outdoor"] as const).map((loc) => (
          <button
            key={loc}
            onClick={() => setLocationFilter(loc)}
            className={`text-sm px-3 py-1 rounded-full capitalize transition-colors ${
              locationFilter === loc
                ? loc === "indoor"
                  ? "bg-brand-primary text-white font-semibold"
                  : loc === "outdoor"
                    ? "bg-brand-secondary text-white font-semibold"
                    : "bg-neutral-800 text-white font-semibold"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {loc}
          </button>
        ))}
      </div>

      {/* Banners */}
      {showLargeOrderBanner && largeOrders.length > 0 && (
        <div className="bg-warning-bg border border-warning-border rounded-lg px-4 py-3 mb-4 flex items-center justify-between">
          <span className="text-sm font-medium text-neutral-900">
            Large order: {largeOrders.map((o) => `${o.orderNumber} (${o.client.name} - $${o.totalPrice})`).join(", ")}
          </span>
          <button onClick={() => setShowLargeOrderBanner(false)} className="text-neutral-600 hover:text-neutral-900 text-sm">
            Dismiss
          </button>
        </div>
      )}

      {showSubBanner && subNotifications.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-4 flex items-center justify-between">
          <span className="text-sm font-medium text-green-800">
            {subNotifications[0]?.message}
          </span>
          <button onClick={dismissSubBanner} className="text-green-600 hover:text-green-900 text-sm">
            Dismiss
          </button>
        </div>
      )}

      {/* Views */}
      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-neutral-100 rounded-lg" />
          ))}
        </div>
      ) : view === "day" ? (
        <DayView
          orders={orders}
          date={date}
        />
      ) : view === "week" ? (
        <WeekView
          orders={orders}
          date={date}
          onSelectDay={(d) => {
            setDate(d);
            setView("day");
          }}
        />
      ) : (
        <MonthView
          orders={orders}
          date={date}
          onSelectDay={(d) => {
            setDate(d);
            setView("day");
          }}
        />
      )}

      {/* Orders now use full pages at /orders/new and /orders/[id] */}
    </div>
  );
}

function DayView({
  orders,
  date,
}: {
  orders: OrderData[];
  date: Date;
}) {
  const dayOrders = orders.filter((o) =>
    isSameDay(new Date(o.deliveryDate), date)
  );
  const sorted = sortByTimeWindow(dayOrders);
  const pickups = sorted.filter((o) => o.deliveryMethod === "pickup");
  const deliveries = sorted.filter((o) => o.deliveryMethod === "delivery");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-neutral-900">
            Orders ({dayOrders.length})
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() =>
                window.open(
                  `/print/labels?date=${format(date, "yyyy-MM-dd")}`,
                  "_blank"
                )
              }
              className="text-neutral-600 hover:bg-neutral-100 p-1.5 rounded-md"
              title="Print Labels for Today"
            >
              <Printer className="w-4 h-4" />
            </button>
            <Link
              href="/orders/new"
              className="bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-semibold px-3 py-1.5 rounded-md flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              New
            </Link>
          </div>
        </div>
        {dayOrders.length === 0 ? (
          <div className="bg-white rounded-lg border border-neutral-200 p-8 text-center">
            <p className="text-sm text-neutral-400 mb-3">
              No orders for this date
            </p>
            <Link
              href="/orders/new"
              className="bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-semibold px-4 py-2 rounded-md"
            >
              Create Order
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-base font-semibold text-neutral-900 mb-3">
          Today&apos;s Spread
        </h3>
        <div className="bg-white rounded-lg border border-neutral-200 p-4 space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">
              Pickups ({pickups.length})
            </h4>
            {pickups.length === 0 ? (
              <p className="text-xs text-neutral-400">None</p>
            ) : (
              <div className="space-y-2">
                {pickups.map((o) => (
                  <div key={o.id} className="text-sm">
                    <span className="text-neutral-400 text-xs">
                      {o.deliveryTimeWindow || "TBD"}
                    </span>
                    <span className="ml-2 font-medium">{o.orderNumber}</span>
                    <span className="ml-2 text-neutral-600">
                      {o.client.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <hr className="border-neutral-200" />
          <div>
            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">
              Deliveries ({deliveries.length})
            </h4>
            {deliveries.length === 0 ? (
              <p className="text-xs text-neutral-400">None</p>
            ) : (
              <div className="space-y-2">
                {deliveries.map((o) => (
                  <div key={o.id} className="text-sm">
                    <span className="text-neutral-400 text-xs">
                      {o.deliveryTimeWindow || "TBD"}
                    </span>
                    <span className="ml-2 font-medium">{o.orderNumber}</span>
                    <span className="ml-2 text-neutral-600">
                      {o.recipientName || o.client.name}
                    </span>
                    {o.deliveryAddress && (
                      <p className="text-xs text-neutral-400 ml-14">
                        {o.deliveryAddress}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: OrderData }) {
  const borderColor =
    order.locationType === "outdoor"
      ? "border-l-brand-secondary"
      : order.locationType === "indoor"
        ? "border-l-brand-primary"
        : order.isSubscriptionGenerated
          ? "border-l-amber-500"
          : "border-l-brand-primary";

  const arrangementSummary = order.lineItems?.map(li => li.arrangementType).filter(Boolean).join(", ");

  return (
    <Link
      href={`/orders/${order.id}`}
      className={`block bg-white rounded-lg border border-neutral-200 border-l-[3px] ${borderColor} p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-neutral-900">
              {order.orderNumber}
            </span>
            <span className="text-sm text-neutral-600">
              {order.client.name}
              {order.recipientName &&
                order.recipientName !== order.client.name &&
                ` \u2192 ${order.recipientName}`}
            </span>
          </div>
          {order.deliveryAddress && (
            <p className="text-xs text-neutral-400">{order.deliveryAddress}</p>
          )}
          <p className="text-xs text-neutral-400 mt-1">
            {order.deliveryTimeWindow || "No time set"} {arrangementSummary && `\u00B7 ${arrangementSummary}`}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
            order.locationType === "outdoor"
              ? "bg-green-100 text-green-700"
              : "bg-pink-100 text-pink-700"
          }`}>
            {order.locationType}
          </span>
          <Badge
            variant={order.deliveryMethod as "delivery" | "pickup"}
          >
            {order.deliveryMethod === "pickup" ? "Pickup" : "Delivery"}
          </Badge>
          <Badge variant={order.paymentStatus as "paid" | "unpaid" | "partial"}>
            {order.paymentStatus}
          </Badge>
        </div>
      </div>
    </Link>
  );
}

function WeekView({
  orders,
  date,
  onSelectDay,
}: {
  orders: OrderData[];
  date: Date;
  onSelectDay: (d: Date) => void;
}) {
  const weekStart = startOfWeek(date, { weekStartsOn: 0 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day) => {
        const dayOrders = orders.filter((o) =>
          isSameDay(new Date(o.deliveryDate), day)
        );
        return (
          <div
            key={day.toISOString()}
            onClick={() => onSelectDay(day)}
            className={`bg-white rounded-lg border p-3 min-h-24 cursor-pointer hover:shadow-md transition-shadow ${
              isToday(day) ? "border-brand-primary" : "border-neutral-200"
            }`}
          >
            <p
              className={`text-xs font-semibold mb-1 ${
                isToday(day) ? "text-brand-primary" : "text-neutral-600"
              }`}
            >
              {format(day, "EEE d")}
            </p>
            {dayOrders.length > 0 && (
              <p className="text-sm font-bold text-neutral-900">
                {dayOrders.length}
              </p>
            )}
            <div className="flex gap-1 mt-1 flex-wrap">
              {dayOrders.slice(0, 3).map((o) => (
                <span
                  key={o.id}
                  className={`w-2 h-2 rounded-full ${
                    o.locationType === "outdoor"
                      ? "bg-brand-secondary"
                      : "bg-brand-primary"
                  }`}
                />
              ))}
              {dayOrders.length > 3 && (
                <span className="text-xs text-neutral-400">
                  +{dayOrders.length - 3}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MonthView({
  orders,
  date,
  onSelectDay,
}: {
  orders: OrderData[];
  date: Date;
  onSelectDay: (d: Date) => void;
}) {
  const monthStart = startOfMonth(date);
  const daysInMonth = getDaysInMonth(date);
  const startDayOfWeek = getDay(monthStart);

  const cells = [];
  // Empty cells before month starts
  for (let i = 0; i < startDayOfWeek; i++) {
    cells.push(<div key={`empty-${i}`} className="min-h-20" />);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const cellDate = new Date(date.getFullYear(), date.getMonth(), d);
    const dayOrders = orders.filter((o) =>
      isSameDay(new Date(o.deliveryDate), cellDate)
    );

    cells.push(
      <div
        key={d}
        onClick={() => onSelectDay(cellDate)}
        className={`bg-white rounded-lg border p-2 min-h-20 cursor-pointer hover:shadow-md transition-shadow ${
          isToday(cellDate) ? "border-brand-primary" : "border-neutral-200"
        }`}
      >
        <p
          className={`text-xs font-semibold ${
            isToday(cellDate) ? "text-brand-primary" : "text-neutral-900"
          }`}
        >
          {d}
        </p>
        {dayOrders.length > 0 && (
          <p className="text-xs text-neutral-600 mt-1">{dayOrders.length} orders</p>
        )}
        <div className="flex gap-0.5 mt-1 flex-wrap">
          {dayOrders.slice(0, 3).map((o) => (
            <span
              key={o.id}
              className={`w-1.5 h-1.5 rounded-full ${
                o.locationType === "outdoor"
                  ? "bg-brand-secondary"
                  : "bg-brand-primary"
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            className="text-xs font-semibold text-neutral-400 text-center py-1"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">{cells}</div>
    </div>
  );
}
