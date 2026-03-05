"use client";

import { useToast } from "@/lib/context/ToastContext";
import { X } from "lucide-react";

const typeStyles = {
  success: "bg-brand-secondary text-white",
  error: "bg-danger text-white",
  info: "bg-neutral-900 text-white",
  warning: "bg-warning-bg text-neutral-900 border border-warning-border",
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium min-w-64 max-w-sm animate-slide-in ${typeStyles[toast.type]}`}
        >
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="opacity-70 hover:opacity-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
