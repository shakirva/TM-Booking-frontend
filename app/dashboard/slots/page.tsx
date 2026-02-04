"use client";
import React, { useState, useEffect } from "react";
import { getToken } from "@/lib/auth";
import { getSlotPricing, updateSlotPricing } from "@/lib/api";
import { FiDollarSign, FiCalendar, FiSave, FiRefreshCw } from "react-icons/fi";
import { FaMoon, FaSun, FaCoffee } from "react-icons/fa";

interface SlotPricing {
  id: number;
  slot_name: string;
  current_price: number;
  future_price: number | null;
  effective_from: string | null;
  updated_at: string;
}

type SlotKey = "Lunch" | "Reception" | "Night";

const slotConfig = {
  Lunch: { label: "Lunch", icon: FaSun, color: "from-amber-400 to-orange-500", bgColor: "bg-amber-50", textColor: "text-amber-700" },
  Reception: { label: "Reception", icon: FaCoffee, color: "from-blue-400 to-indigo-500", bgColor: "bg-blue-50", textColor: "text-blue-700" },
  Night: { label: "Night", icon: FaMoon, color: "from-indigo-500 to-purple-600", bgColor: "bg-purple-50", textColor: "text-purple-700" }
};

export default function SlotsPage() {
  const [selectedSlot, setSelectedSlot] = useState<SlotKey>("Lunch");
  const [pricing, setPricing] = useState<SlotPricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form state for editing
  const [currentPrice, setCurrentPrice] = useState<number>(40000);
  const [futurePrice, setFuturePrice] = useState<number | "">("");
  const [effectiveFrom, setEffectiveFrom] = useState<string>("");

  // Fetch pricing data
  const fetchPricing = async () => {
    setLoading(true);
    try {
      const data = await getSlotPricing();
      setPricing(data || []);
    } catch (err) {
      console.error("Error fetching pricing:", err);
      // Set default pricing if API fails
      setPricing([
        { id: 1, slot_name: "Lunch", current_price: 40000, future_price: null, effective_from: null, updated_at: "" },
        { id: 2, slot_name: "Reception", current_price: 40000, future_price: null, effective_from: null, updated_at: "" },
        { id: 3, slot_name: "Night", current_price: 15000, future_price: null, effective_from: null, updated_at: "" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricing();
  }, []);

  // Update form when selected slot changes
  useEffect(() => {
    const slotPricing = pricing.find(p => p.slot_name === selectedSlot);
    if (slotPricing) {
      setCurrentPrice(slotPricing.current_price || 0);
      setFuturePrice(slotPricing.future_price || "");
      setEffectiveFrom(slotPricing.effective_from ? slotPricing.effective_from.split("T")[0] : "");
    } else {
      // Defaults
      setCurrentPrice(selectedSlot === "Night" ? 15000 : 40000);
      setFuturePrice("");
      setEffectiveFrom("");
    }
  }, [selectedSlot, pricing]);

  const handleSave = async () => {
    const token = getToken();
    if (!token) {
      setMessage({ type: "error", text: "Not authenticated. Please login again." });
      return;
    }

    if (!currentPrice || currentPrice <= 0) {
      setMessage({ type: "error", text: "Current price must be greater than 0" });
      return;
    }

    if (futurePrice && effectiveFrom) {
      const effDate = new Date(effectiveFrom);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (effDate <= today) {
        setMessage({ type: "error", text: "Effective date must be in the future" });
        return;
      }
    }

    setSaving(true);
    try {
      await updateSlotPricing(selectedSlot, {
        current_price: currentPrice,
        future_price: futurePrice ? Number(futurePrice) : undefined,
        effective_from: effectiveFrom || undefined
      }, token);
      setMessage({ type: "success", text: `${selectedSlot} pricing updated successfully!` });
      await fetchPricing();
    } catch (err) {
      console.error("Error updating pricing:", err);
      setMessage({ type: "error", text: "Failed to update pricing. Please try again." });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const handleReset = () => {
    const slotPricing = pricing.find(p => p.slot_name === selectedSlot);
    if (slotPricing) {
      setCurrentPrice(slotPricing.current_price || 0);
      setFuturePrice(slotPricing.future_price || "");
      setEffectiveFrom(slotPricing.effective_from ? slotPricing.effective_from.split("T")[0] : "");
    }
  };

  const config = slotConfig[selectedSlot];
  const Icon = config.icon;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading slot pricing...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Slot Pricing Management</h1>
        <p className="text-gray-500 text-sm mt-1">Configure current and future prices for each slot with effective dates</p>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-lg ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar - Slot Selection */}
          <aside className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-gray-200">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-700">Available Slots</h3>
            </div>
            <nav className="p-3 space-y-2">
              {(Object.keys(slotConfig) as SlotKey[]).map((slot) => {
                const cfg = slotConfig[slot];
                const SlotIcon = cfg.icon;
                const slotPricing = pricing.find(p => p.slot_name === slot);
                const isSelected = selectedSlot === slot;
                
                return (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isSelected 
                        ? `bg-gradient-to-r ${cfg.color} text-white shadow-lg` 
                        : `${cfg.bgColor} ${cfg.textColor} hover:shadow-md`
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <SlotIcon className="h-5 w-5" />
                      <div className="flex-1">
                        <div className="font-semibold">{cfg.label}</div>
                        <div className={`text-sm ${isSelected ? "text-white/80" : "opacity-70"}`}>
                          ₹{(slotPricing?.current_price || 0).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    {slotPricing?.future_price && slotPricing?.effective_from && (
                      <div className={`mt-2 text-xs ${isSelected ? "text-white/70" : "opacity-60"}`}>
                        Future: ₹{slotPricing.future_price.toLocaleString()}
                      </div>
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main Content - Pricing Form */}
          <section className="flex-1 p-6">
            <div className="max-w-xl">
              {/* Slot Header */}
              <div className={`flex items-center gap-4 mb-6 p-4 rounded-xl bg-gradient-to-r ${config.color}`}>
                <div className="bg-white/20 rounded-lg p-3">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-white">
                  <h2 className="text-xl font-bold">{config.label} Slot</h2>
                  <p className="text-white/80 text-sm">Configure pricing and effective dates</p>
                </div>
              </div>

              {/* Current Price */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FiDollarSign className="text-green-600" />
                  Current Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={currentPrice}
                  onChange={(e) => setCurrentPrice(Number(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg font-semibold text-gray-900 bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
                  placeholder="Enter current price"
                />
                <p className="text-xs text-gray-500 mt-1">This price applies to all bookings until the effective date</p>
              </div>

              {/* Future Price Section */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-5 mb-6 border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FiCalendar className="text-blue-600" />
                  Future Price (Optional)
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Future Price (₹)</label>
                    <input
                      type="number"
                      min={0}
                      step={1000}
                      value={futurePrice}
                      onChange={(e) => setFuturePrice(e.target.value ? Number(e.target.value) : "")}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
                      placeholder="e.g., 45000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Effective From</label>
                    <input
                      type="date"
                      value={effectiveFrom}
                      onChange={(e) => setEffectiveFrom(e.target.value)}
                      min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
                    />
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 mt-3">
                  Bookings with event date ≥ effective date will automatically use the future price
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <FiSave className="h-5 w-5" />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors border border-gray-200"
                >
                  <FiRefreshCw className="h-5 w-5" />
                  Reset
                </button>
              </div>

              {/* Pricing Preview */}
              {futurePrice && effectiveFrom && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <h4 className="font-semibold text-blue-800 mb-2">Pricing Preview</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>• Bookings before {new Date(effectiveFrom).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}: <strong>₹{currentPrice.toLocaleString()}</strong></p>
                    <p>• Bookings on/after {new Date(effectiveFrom).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}: <strong>₹{Number(futurePrice).toLocaleString()}</strong></p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
