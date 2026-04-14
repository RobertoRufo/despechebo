import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface Props {
  onUnlock: (pin: string) => void;
}

export default function PasswordGate({ onUnlock }: Props) {
  const [input, setInput] = useState("");
  const [shaking, setShaking] = useState(false);

  const verify = trpc.site.verifyPin.useMutation({
    onSuccess: () => {
      onUnlock(input.trim().toUpperCase());
    },
    onError: () => {
      setShaking(true);
      setInput("");
      toast.error("Wrong PIN. Try again.");
      setTimeout(() => setShaking(false), 600);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    verify.mutate({ pin: input.trim().toUpperCase() });
  };

  return (
    <div className="min-h-screen hero-bg flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Floating festive emojis */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none select-none">
        {["💃","🕺","🇪🇸","🌹","🥂","🎉","🏟️","🎸","🌞","🍷","💃","🕺","🇪🇸","🌹","🥂","🎉","🌞","🍷","🎸","🏟️"].map((emoji, i) => (
          <div
            key={i}
            className="star absolute text-lg opacity-20"
            style={{
              left: (i * 5.3 + Math.sin(i) * 8) % 100 + "%",
              top: (i * 4.7 + Math.cos(i) * 10) % 100 + "%",
              "--duration": (2 + (i % 4)) + "s",
              "--delay": (i * 0.3) % 3 + "s",
              fontSize: (14 + (i % 3) * 6) + "px",
            } as React.CSSProperties}
          >
            {emoji}
          </div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Title */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🇪🇸</div>
          <h1 className="font-display text-5xl font-black text-white mb-1 drop-shadow-lg">
            Despedida
          </h1>
          <h2 className="font-display text-3xl font-bold text-yellow-300 mb-3 drop-shadow">
            de Soltero
          </h2>
          <div className="flex items-center justify-center gap-3 mb-1">
            <div className="h-px w-12 bg-yellow-300/50" />
            <p className="text-yellow-200/80 text-sm tracking-[0.25em] uppercase font-medium">
              Madrid · 2026
            </p>
            <div className="h-px w-12 bg-yellow-300/50" />
          </div>
          <p className="text-white/60 text-xs mt-2">💃 Sebastian's Bachelor Party 🕺</p>
        </div>

        {/* PIN Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            className={`transition-transform ${shaking ? "animate-[shake_0.5s_ease]" : ""}`}
            style={shaking ? { animation: "shake 0.5s ease" } : {}}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value.toUpperCase())}
              placeholder="Enter PIN"
              maxLength={20}
              autoFocus
              className="w-full bg-white/10 backdrop-blur border-2 border-yellow-300/40 rounded-2xl px-5 py-4 text-center text-xl font-bold tracking-[0.3em] text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 transition"
            />
          </div>
          <button
            type="submit"
            disabled={verify.isPending || !input.trim()}
            className="w-full bg-yellow-400 text-red-900 font-black py-4 rounded-2xl text-lg hover:bg-yellow-300 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-400/30"
          >
            {verify.isPending ? "Verifying..." : "¡Vamos! 🎉"}
          </button>
        </form>

        <p className="text-center text-white/40 text-xs mt-6">
          This site is private. Ask Roberto for the PIN.
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-10px); }
          40% { transform: translateX(10px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
}
