interface BadgeProps {
  variant:
    | "delivery"
    | "pickup"
    | "subscription"
    | "paid"
    | "unpaid"
    | "partial"
    | "confirmed"
    | "in_progress"
    | "ready"
    | "delivered"
    | "cancelled"
    | "draft"
    | "active"
    | "paused";
  children: React.ReactNode;
}

const variantStyles: Record<string, string> = {
  delivery: "bg-delivery-bg text-delivery-text",
  pickup: "bg-pickup-bg text-pickup-text",
  subscription: "bg-subscription-bg text-subscription-text",
  paid: "bg-green-100 text-green-800",
  unpaid: "bg-red-100 text-red-800",
  partial: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  in_progress: "bg-orange-100 text-orange-800",
  ready: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-neutral-100 text-neutral-600",
  draft: "bg-neutral-100 text-neutral-600",
  active: "bg-green-100 text-green-800",
  paused: "bg-yellow-100 text-yellow-800",
};

export default function Badge({ variant, children }: BadgeProps) {
  return (
    <span
      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
        variantStyles[variant] || "bg-neutral-100 text-neutral-600"
      }`}
    >
      {children}
    </span>
  );
}
