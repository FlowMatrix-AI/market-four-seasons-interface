"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Calendar, Users, Package, Settings as SettingsIcon, LogOut, Bell } from "lucide-react";
import { AuthProvider, useAuth } from "@/lib/context/AuthContext";
import { ToastProvider } from "@/lib/context/ToastContext";
import { SettingsProvider } from "@/lib/context/SettingsContext";
import ToastContainer from "@/components/ui/Toast";
import { type ReactNode } from "react";

function SidebarNav() {
  const pathname = usePathname();
  const { user, isOwner, logout } = useAuth();

  const navItems = [
    { href: "/", label: "Calendar", icon: Calendar },
    { href: "/customers", label: "Customers", icon: Users },
    { href: "/orders", label: "Orders", icon: Package },
  ];

  if (isOwner) {
    navItems.push({ href: "/settings", label: "Settings", icon: SettingsIcon });
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-56 bg-white border-r border-neutral-200 flex flex-col z-40 max-md:hidden">
      <div className="px-4 py-5">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-accent text-brand-primary flex items-center justify-center font-bold text-sm">
            B
          </div>
          <span className="text-lg font-bold text-neutral-900">Bloom</span>
        </Link>
      </div>

      <nav className="flex-1 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 mx-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-brand-accent text-brand-primary font-semibold border-l-2 border-brand-primary rounded-r-lg -ml-px"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-neutral-200">
        <p className="text-sm font-medium text-neutral-900 truncate">
          {user?.name || "User"}
        </p>
        <p className="text-xs text-neutral-400 capitalize">{user?.role}</p>
        <button
          onClick={logout}
          className="mt-2 flex items-center gap-2 text-neutral-600 hover:text-neutral-900 text-sm"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </aside>
  );
}

function MobileNav() {
  const pathname = usePathname();
  const { isOwner } = useAuth();

  const navItems = [
    { href: "/", label: "Calendar", icon: Calendar },
    { href: "/customers", label: "Customers", icon: Users },
    { href: "/orders", label: "Orders", icon: Package },
  ];

  if (isOwner) {
    navItems.push({ href: "/settings", label: "Settings", icon: SettingsIcon });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-40 md:hidden">
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1 text-xs ${
                isActive
                  ? "text-brand-primary font-semibold"
                  : "text-neutral-400"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function TopBar({ title }: { title: string }) {
  return (
    <header className="h-14 bg-white border-b border-neutral-200 px-6 flex items-center justify-between">
      <h1 className="text-xl font-bold text-neutral-900">{title}</h1>
      <div className="flex items-center gap-4">
        <Link
          href="/notifications"
          className="relative text-neutral-400 hover:text-neutral-600"
        >
          <Bell className="w-5 h-5" />
        </Link>
      </div>
    </header>
  );
}

const pageTitles: Record<string, string> = {
  "/": "Calendar",
  "/customers": "Customers",
  "/orders": "Orders",
  "/settings": "Settings",
};

function AppContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const title =
    pageTitles[pathname] ||
    (pathname.startsWith("/customers/") ? "Client Profile" : "Bloom");

  return (
    <div className="md:ml-56 min-h-screen bg-neutral-50 pb-16 md:pb-0">
      <TopBar title={title} />
      <main className="p-6">{children}</main>
    </div>
  );
}

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <SettingsProvider>
          <SidebarNav />
          <MobileNav />
          <AppContent>{children}</AppContent>
          <ToastContainer />
        </SettingsProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
