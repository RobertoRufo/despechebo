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
    <div className="flex items-start justify-between gap-3 py-3 border-b border-border last:border-0">
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-foreground font-medium text-sm">{value}</p>
      </div>
      {copyable && (
        <button onClick={copy} className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary transition mt-1">
          {copied ? "✓ Copied" : "Copy"}
        </button>
      )}
    </div>
  );
}

export default function AirbnbSection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-gold-gradient mb-2">Accommodation</h2>
        <p className="text-muted-foreground text-sm mb-8">Airbnb · Malasaña, Madrid</p>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-accent/20 to-card px-5 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏠</span>
              <div>
                <p className="font-display font-bold text-xl text-foreground">Calle del Espíritu Santo 2</p>
                <p className="text-muted-foreground text-sm">Madrid 28004 · Malasaña</p>
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
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-primary/40 text-primary text-sm font-semibold hover:bg-primary/10 transition"
            >
              📍 Open in Google Maps
            </a>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-4 bg-card border border-border rounded-xl px-5 py-4 space-y-2">
          <p className="text-sm font-semibold text-foreground">📋 Arrival Tips</p>
          <p className="text-sm text-muted-foreground">Contact host Mar on arrival for access instructions. The apartment is in the heart of Malasaña — perfect for walking to bars and restaurants.</p>
        </div>
      </div>
    </section>
  );
}
