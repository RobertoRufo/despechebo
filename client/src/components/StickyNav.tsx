import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { id: "hero", label: "🏠 Home" },
  { id: "itinerary", label: "🗓️ Itinerary" },
  { id: "flights", label: "✈️ Flights" },
  { id: "airbnb", label: "🏡 Airbnb" },
  { id: "crew", label: "💃 The Crew" },
  { id: "packing", label: "🧳 Packing" },
  { id: "journal", label: "📸 Journal" },
];

interface Props {
  activeSection: string;
  onNavigate: (id: string) => void;
}

export default function StickyNav({ activeSection, onNavigate }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-red-100 shadow-md shadow-red-900/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-none">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                activeSection === item.id
                  ? "bg-red-600 text-white shadow-sm shadow-red-600/30"
                  : scrolled
                  ? "text-stone-500 hover:text-red-700 hover:bg-red-50"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
