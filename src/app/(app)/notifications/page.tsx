"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, Check } from "lucide-react";
import { format } from "date-fns";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const markRead = async (id: string) => {
    const res = await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-neutral-100 rounded-lg" />
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
        <Bell className="w-12 h-12 mb-3" />
        <p className="text-lg font-medium">No notifications</p>
        <p className="text-sm">You&apos;re all caught up!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-w-2xl">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`flex items-start gap-3 p-4 rounded-lg border ${
            n.read
              ? "bg-white border-neutral-200"
              : "bg-brand-accent/30 border-brand-primary/20"
          }`}
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-neutral-900">{n.title}</p>
            <p className="text-sm text-neutral-600 mt-0.5">{n.message}</p>
            <p className="text-xs text-neutral-400 mt-1">
              {format(new Date(n.createdAt), "MMM d, h:mm a")}
            </p>
          </div>
          {!n.read && (
            <button
              onClick={() => markRead(n.id)}
              className="text-brand-primary hover:text-brand-primary/80 p-1"
              title="Mark as read"
            >
              <Check className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
