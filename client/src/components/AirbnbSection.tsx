import { useState } from "react";
import { toast } from "sonner";

function InfoRow({ label, value, copyable }: { label: string; value: string; copyable?: boolean }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      toast.success("Copied!");
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className="flex items-start justify-between gap-3 py-3 border-b border-stone-100 last:border-0">
      <div>
        <p className="text-xs text-stone-400 uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-stone-800 font-semibold text-sm">{value}</p>
      </div>
      {copyable && (
        <button
          onClick={copy}
          className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg border border-stone-200 text-stone-500 hover:text-red-700 hover:border-red-300 hover:bg-red-50 transition mt-1"
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      )}
    </div>
  );
}

export default function AirbnbSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-black text-red-700 mb-2">🏡 Accommodation</h2>
        <p className="text-stone-500 text-sm mb-8">Airbnb · Malasaña, Madrid</p>

        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm shadow-red-900/5">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-5 py-4 border-b border-red-700">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏠</span>
              <div>
                <p className="font-display font-bold text-xl text-white">Calle del Espíritu Santo 2</p>
                <p className="text-red-200 text-sm">Madrid 28004 · Malasaña</p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="px-5">
            <InfoRow label="Full Address" value="Calle del Espíritu Santo, 2 1º-1, Madrid 28004, Spain" copyable />
            <InfoRow label="Check-in" value="Wednesday, April 29 · From 3:00 PM" />
            <InfoRow label="Check-out" value="Wednesday, May 6 · Before 11:00 AM" />
            <InfoRow label="Host" value="Mar" />
            <InfoRow label="Host Phone" value="+34 645 90 97 26" copyable />
            <InfoRow label="Confirmation Code" value="HMESCMBRRJ" copyable />
          </div>

          {/* Map link */}
          <div className="px-5 pb-5 pt-2">
            <a
              href="https://maps.google.com/?q=Calle+del+Espiritu+Santo+2+1-1+Madrid+28004+Spain"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-red-200 text-red-700 text-sm font-semibold hover:bg-red-50 transition"
            >
              📍 Open in Google Maps
            </a>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 space-y-2">
          <p className="text-sm font-semibold text-stone-700">📋 Arrival Tips</p>
          <p className="text-sm text-stone-500">Contact host Mar on arrival for access instructions. The apartment is in the heart of Malasaña — perfect for walking to bars and restaurants.</p>
        </div>
      </div>
    </section>
  );
}
