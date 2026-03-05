"use client";

import { createContext, useContext, useState, useCallback, useSyncExternalStore, type ReactNode } from "react";

interface Settings {
  shop_name: string;
  shop_address: string;
  shop_phone: string;
  shop_email: string;
  shop_hst: string;
  shop_logo_url: string;
  large_order_threshold: string;
  label_layout: string;
  time_presets: string;
}

const defaultSettings: Settings = {
  shop_name: "Market Four Seasons",
  shop_address: "2032 Avenue Rd, Toronto, ON M5M 2R8",
  shop_phone: "(416) 481-0102",
  shop_email: "marketfourseasons@gmail.com",
  shop_hst: "867392979",
  shop_logo_url: "",
  large_order_threshold: "200",
  label_layout: "2up",
  time_presets: '["AM","10am-1pm","1pm-5pm"]',
};

interface SettingsContextType {
  settings: Settings;
  updateSetting: (key: string, value: string) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

// External store for settings to avoid setState-in-effect lint errors
let settingsStore = defaultSettings;
let settingsListeners: Array<() => void> = [];
function getSettingsSnapshot() { return settingsStore; }
function subscribeSettings(listener: () => void) {
  settingsListeners.push(listener);
  // Trigger initial fetch
  if (settingsListeners.length === 1) {
    fetch("/api/settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          settingsStore = { ...defaultSettings, ...data };
          settingsListeners.forEach((l) => l());
        }
      })
      .catch(() => {});
  }
  return () => {
    settingsListeners = settingsListeners.filter((l) => l !== listener);
  };
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const externalSettings = useSyncExternalStore(subscribeSettings, getSettingsSnapshot, () => defaultSettings);
  const [localOverrides, setLocalOverrides] = useState<Partial<Settings>>({});

  const settings = { ...externalSettings, ...localOverrides };

  const refreshSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        settingsStore = { ...defaultSettings, ...data };
        setLocalOverrides({});
        settingsListeners.forEach((l) => l());
      }
    } catch {
      // Use defaults
    }
  }, []);

  const updateSetting = async (key: string, value: string) => {
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
    if (res.ok) {
      setLocalOverrides((prev) => ({ ...prev, [key]: value }));
    }
  };

  return (
    <SettingsContext value={{ settings, updateSetting, refreshSettings }}>
      {children}
    </SettingsContext>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
