import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import PasswordGate from "@/components/PasswordGate";
import StickyNav from "@/components/StickyNav";
import HeroSection from "@/components/HeroSection";
import ItinerarySection from "@/components/ItinerarySection";
import FlightsSection from "@/components/FlightsSection";
import AirbnbSection from "@/components/AirbnbSection";
import CrewSection from "@/components/CrewSection";
import JournalSection from "@/components/JournalSection";

const PIN_KEY = "despedida_pin";

export default function Home() {
  const [pin, setPin] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem(PIN_KEY);
    }
    return null;
  });
  const [activeSection, setActiveSection] = useState("hero");

  const sectionRefs = {
    hero: useRef<HTMLDivElement>(null),
    itinerary: useRef<HTMLDivElement>(null),
    flights: useRef<HTMLDivElement>(null),
    airbnb: useRef<HTMLDivElement>(null),
    crew: useRef<HTMLDivElement>(null),
    journal: useRef<HTMLDivElement>(null),
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    Object.entries(sectionRefs).forEach(([id, ref]) => {
      if (ref.current) observer.observe(ref.current);
    });
    return () => observer.disconnect();
  }, [pin]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleUnlock = (validPin: string) => {
    sessionStorage.setItem(PIN_KEY, validPin);
    setPin(validPin);
  };

  if (!pin) {
    return <PasswordGate onUnlock={handleUnlock} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StickyNav activeSection={activeSection} onNavigate={scrollTo} />

      <div id="hero" ref={sectionRefs.hero}>
        <HeroSection />
      </div>

      <div id="itinerary" ref={sectionRefs.itinerary}>
        <ItinerarySection pin={pin} />
      </div>

      <div id="flights" ref={sectionRefs.flights}>
        <FlightsSection />
      </div>

      <div id="airbnb" ref={sectionRefs.airbnb}>
        <AirbnbSection />
      </div>

      <div id="crew" ref={sectionRefs.crew}>
        <CrewSection />
      </div>

      <div id="journal" ref={sectionRefs.journal}>
        <JournalSection pin={pin} />
      </div>

      <footer className="py-8 text-center border-t border-border">
        <p className="font-display text-xl text-gold-gradient mb-1">¡Viva Sebastian! 🥂</p>
        <p className="text-muted-foreground text-sm">Madrid · April 29 – May 6, 2026</p>
      </footer>
    </div>
  );
}
