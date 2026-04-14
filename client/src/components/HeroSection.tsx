import { useEffect, useState, useMemo } from "react";

const TRIP_DATE = new Date("2026-04-29T12:15:00");

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds, arrived: diff === 0 };
}

const STARS = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  size: Math.random() * 2.5 + 0.5,
  left: Math.random() * 100,
  top: Math.random() * 100,
  duration: Math.random() * 3 + 2,
  delay: Math.random() * 4,
}));

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-card border border-border rounded-xl px-4 py-3 min-w-[72px] text-center">
        <span className="font-display text-4xl md:text-5xl font-black text-primary leading-none">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-muted-foreground text-xs mt-1.5 uppercase tracking-widest">{label}</span>
    </div>
  );
}

export default function HeroSection() {
  const { days, hours, minutes, seconds, arrived } = useCountdown(TRIP_DATE);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-16 overflow-hidden">
      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {STARS.map((s) => (
          <div
            key={s.id}
            className="star absolute rounded-full bg-amber-200"
            style={{
              width: s.size + "px",
              height: s.size + "px",
              left: s.left + "%",
              top: s.top + "%",
              "--duration": s.duration + "s",
              "--delay": s.delay + "s",
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,oklch(0.55_0.22_25/0.12)_0%,transparent_70%)]" />

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Flag */}
        <div className="text-6xl mb-4">🇪🇸</div>

        {/* Title */}
        <h1 className="font-display text-5xl md:text-7xl font-black text-gold-gradient mb-2 leading-tight">
          Despedida
        </h1>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-1">
          de Soltero
        </h2>
        <p className="text-muted-foreground text-lg mb-1 tracking-wide">
          Sebastian's Bachelor Party
        </p>
        <div className="spanish-flag-bar w-32 mx-auto my-5 rounded-full" />
        <p className="text-foreground/80 text-base mb-10 font-medium">
          Madrid, Spain · April 29 – May 6, 2026
        </p>

        {/* Countdown */}
        {arrived ? (
          <div className="text-3xl font-display font-bold text-primary animate-pulse">
            ¡Estamos en Madrid! 🎉
          </div>
        ) : (
          <>
            <p className="text-muted-foreground text-sm uppercase tracking-widest mb-4">
              Countdown to Takeoff
            </p>
            <div className="flex items-start justify-center gap-3 md:gap-4">
              <CountdownUnit value={days} label="Days" />
              <span className="font-display text-4xl text-primary mt-3">:</span>
              <CountdownUnit value={hours} label="Hours" />
              <span className="font-display text-4xl text-primary mt-3">:</span>
              <CountdownUnit value={minutes} label="Mins" />
              <span className="font-display text-4xl text-primary mt-3">:</span>
              <CountdownUnit value={seconds} label="Secs" />
            </div>
          </>
        )}

        {/* Scroll hint */}
        <div className="mt-14 flex flex-col items-center gap-2 text-muted-foreground animate-bounce">
          <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4v12M4 10l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </section>
  );
}
