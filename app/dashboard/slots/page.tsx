"use client";
import React from "react";

// Local storage key shared with booking page
const STORAGE_KEY = "slotRates";

type SlotKey = "lunch" | "dinner";

type Rates = { lunchPrice: number; dinnerPrice: number };

const defaultRates: Rates = { lunchPrice: 40000, dinnerPrice: 40000 };

export default function SlotsPage() {
  const [selected, setSelected] = React.useState<SlotKey>("lunch");
  const [rates, setRates] = React.useState<Rates>(defaultRates);
  const [saving, setSaving] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);

  // load from localStorage on mount
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        // Support both dinnerPrice (new) and receptionPrice (legacy)
        const r = JSON.parse(raw) as Partial<Rates> & { receptionPrice?: number };
        setRates({
          lunchPrice: typeof r.lunchPrice === "number" ? r.lunchPrice : defaultRates.lunchPrice,
          dinnerPrice: typeof r.dinnerPrice === "number" ? r.dinnerPrice : (typeof r.receptionPrice === "number" ? r.receptionPrice : defaultRates.dinnerPrice),
        });
      }
    } catch {}
  }, []);

  const currentValue = selected === "lunch" ? rates.lunchPrice : rates.dinnerPrice;

  const handleSave = () => {
    setSaving(true);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(rates));
      }
      setMsg("Slot rates saved. Booking UI will reflect the changes.");
    } catch {
      setMsg("Failed to save rates.");
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(null), 2500);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-56 border-b md:border-b-0 md:border-r">
          <div className="p-4 font-semibold text-gray-700">Slots</div>
          <nav className="flex md:flex-col gap-2 p-2">
            <button
              className={`px-3 py-2 rounded-lg text-sm text-left border w-full ${
                selected === "lunch" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50"
              }`}
              onClick={() => setSelected("lunch")}
            >
              Lunch Time
            </button>
            <button
              className={`px-3 py-2 rounded-lg text-sm text-left border w-full ${
                selected === "dinner" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50"
              }`}
              onClick={() => setSelected("dinner")}
            >
              Dinner Time
            </button>
          </nav>
        </aside>

        {/* Content */}
        <section className="flex-1 p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{selected === "lunch" ? "Lunch Time" : "Dinner Time"} Rate</h2>
            <p className="text-sm text-gray-500">Editing rate is local to this device and will be used on the Booking page.</p>
          </div>
          <div className="max-w-sm space-y-3">
            <label className="block text-sm font-medium text-gray-700">Amount (₹)</label>
            <input
              type="number"
              min={0}
              step={1}
              value={currentValue}
              onChange={(e) => {
                const val = Number(e.target.value) || 0;
                setRates((r) => (
                  selected === "lunch" ? { ...r, lunchPrice: val } : { ...r, dinnerPrice: val }
                ));
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black bg-white"
            />
            <div className="flex gap-2 mt-2">
              <button
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 border border-gray-200"
                onClick={() => setRates(defaultRates)}
              >
                Reset Defaults
              </button>
            </div>
            {msg && (
              <div className={`text-sm mt-2 ${msg.toLowerCase().includes('saved') ? 'text-green-600' : 'text-red-600'}`}>{msg}</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
