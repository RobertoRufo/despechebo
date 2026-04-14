import { useEffect, useState } from "react";

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

const FESTIVE_EMOJIS = ["💃","🕺","🇪🇸","🌹","🥂","🎉","🏟️","🎸","🌞","🍷","🌮","🎊","🌺","🎶","🏖️","🎭","🥁","🍾","🌟","💫"];

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white/15 backdrop-blur border-2 border-yellow-300/40 rounded-2xl px-4 py-3 min-w-[72px] text-center shadow-lg">
        <span className="font-display text-4xl md:text-5xl font-black text-yellow-300 leading-none drop-shadow">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-yellow-200/70 text-xs mt-2 uppercase tracking-widest font-medium">{label}</span>
    </div>
  );
}

export default function HeroSection() {
  const { days, hours, minutes, seconds, arrived } = useCountdown(TRIP_DATE);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-16 overflow-hidden hero-bg">
      {/* Floating festive emojis background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {FESTIVE_EMOJIS.map((emoji, i) => (
          <div
            key={i}
            className="star absolute opacity-10"
            style={{
              left: (i * 5.1 + Math.sin(i * 1.3) * 12) % 100 + "%",
              top: (i * 4.9 + Math.cos(i * 1.1) * 10) % 100 + "%",
              fontSize: (18 + (i % 4) * 8) + "px",
              "--duration": (2.5 + (i % 5) * 0.7) + "s",
              "--delay": (i * 0.25) % 4 + "s",
            } as React.CSSProperties}
          >
            {emoji}
          </div>
        ))}
      </div>

      {/* Radial warm glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(255,200,50,0.08)_0%,transparent_65%)]" />

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Big flag */}
        <div className="text-7xl mb-5 drop-shadow-lg">🇪🇸</div>

        {/* Title */}
        <h1 className="font-display text-6xl md:text-8xl font-black text-white mb-1 leading-tight drop-shadow-xl">
          Despedida
        </h1>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-yellow-300 mb-3 drop-shadow-lg">
          de Soltero
        </h2>

        {/* Spanish flag bar */}
        <div className="spanish-flag-bar w-40 mx-auto my-5 rounded-full" />

        <p className="text-white/90 text-xl font-semibold mb-1">
          💃 Sebastian's Bachelor Party 🕺
        </p>
        <p className="text-yellow-200/70 text-base mb-10 tracking-wide">
          Madrid, Spain · April 29 – May 6, 2026
        </p>

        {/* Countdown */}
        {arrived ? (
          <div className="text-3xl font-display font-bold text-yellow-300 animate-pulse drop-shadow">
            ¡Estamos en Madrid! 🎉
          </div>
        ) : (
          <>
            <p className="text-yellow-200/60 text-sm uppercase tracking-widest mb-5 font-medium">
              ✈️ Countdown to takeoff
            </p>
            <div className="flex items-start justify-center gap-3 md:gap-4">
              <CountdownUnit value={days} label="Days" />
              <span className="font-display text-4xl text-yellow-300 mt-3 drop-shadow">:</span>
              <CountdownUnit value={hours} label="Hours" />
              <span className="font-display text-4xl text-yellow-300 mt-3 drop-shadow">:</span>
              <CountdownUnit value={minutes} label="Mins" />
              <span className="font-display text-4xl text-yellow-300 mt-3 drop-shadow">:</span>
              <CountdownUnit value={seconds} label="Secs" />
            </div>
          </>
        )}

        {/* Festive row */}
        <div className="mt-10 text-2xl space-x-2 opacity-70">
          🌹 🥂 🎊 💃 🕺 🎊 🥂 🌹
        </div>

        {/* Scroll hint */}
        <div className="mt-8 flex flex-col items-center gap-2 text-yellow-200/50 animate-bounce">
          <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4v12M4 10l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </section>
  );
}
