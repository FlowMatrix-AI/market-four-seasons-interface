"use client";

import { useState } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { useSettings } from "@/lib/context/SettingsContext";
import { useToast } from "@/lib/context/ToastContext";
import { useRouter } from "next/navigation";
import { Download } from "lucide-react";

export default function SettingsPage() {
  const { isOwner, loading } = useAuth();
  const { settings, updateSetting } = useSettings();
  const { addToast } = useToast();
  const router = useRouter();

  const [shopName, setShopName] = useState(settings.shop_name);
  const [shopAddress, setShopAddress] = useState(settings.shop_address);
  const [shopPhone, setShopPhone] = useState(settings.shop_phone);
  const [shopEmail, setShopEmail] = useState(settings.shop_email);
  const [shopHst, setShopHst] = useState(settings.shop_hst);
  const [threshold, setThreshold] = useState(settings.large_order_threshold);
  const [labelLayout, setLabelLayout] = useState(settings.label_layout);

  if (!loading && !isOwner) {
    router.push("/");
    return null;
  }

  const saveShopProfile = async () => {
    await Promise.all([
      updateSetting("shop_name", shopName),
      updateSetting("shop_address", shopAddress),
      updateSetting("shop_phone", shopPhone),
      updateSetting("shop_email", shopEmail),
      updateSetting("shop_hst", shopHst),
    ]);
    addToast("success", "Shop profile saved");
  };

  const saveThreshold = async () => {
    await updateSetting("large_order_threshold", threshold);
    addToast("success", "Threshold saved");
  };

  const saveLabelLayout = async () => {
    await updateSetting("label_layout", labelLayout);
    addToast("success", "Label layout saved");
  };

  const exportData = () => {
    window.open("/api/export", "_blank");
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Shop Profile */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <h3 className="text-base font-semibold mb-4">Shop Profile</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
              Shop Name
            </label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
              Address
            </label>
            <input
              type="text"
              value={shopAddress}
              onChange={(e) => setShopAddress(e.target.value)}
              className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
                Phone
              </label>
              <input
                type="text"
                value={shopPhone}
                onChange={(e) => setShopPhone(e.target.value)}
                className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
                Email
              </label>
              <input
                type="text"
                value={shopEmail}
                onChange={(e) => setShopEmail(e.target.value)}
                className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
              HST #
            </label>
            <input
              type="text"
              value={shopHst}
              onChange={(e) => setShopHst(e.target.value)}
              className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <button
            onClick={saveShopProfile}
            className="bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-semibold px-4 py-2 rounded-md"
          >
            Save Profile
          </button>
        </div>
      </div>

      {/* Large Order Threshold */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <h3 className="text-base font-semibold mb-4">Large Order Threshold</h3>
        <div className="flex items-center gap-3">
          <span className="text-sm">$</span>
          <input
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            className="w-32 border border-neutral-200 rounded-md px-3 py-2 text-sm"
          />
          <button
            onClick={saveThreshold}
            className="bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-semibold px-4 py-2 rounded-md"
          >
            Save
          </button>
        </div>
      </div>

      {/* Label Layout */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <h3 className="text-base font-semibold mb-4">Label Layout</h3>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              checked={labelLayout === "2up"}
              onChange={() => setLabelLayout("2up")}
            />
            2-up
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              checked={labelLayout === "4up"}
              onChange={() => setLabelLayout("4up")}
            />
            4-up
          </label>
          <button
            onClick={saveLabelLayout}
            className="bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-semibold px-4 py-2 rounded-md"
          >
            Save
          </button>
        </div>
      </div>

      {/* Data Export */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <h3 className="text-base font-semibold mb-4">Data Export</h3>
        <button
          onClick={exportData}
          className="border border-neutral-200 text-neutral-600 hover:bg-neutral-100 text-sm font-semibold px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Export All Data (JSON)
        </button>
      </div>
    </div>
  );
}
