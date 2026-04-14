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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      {/* Stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="star absolute rounded-full bg-amber-300"
            style={{
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              "--duration": Math.random() * 3 + 2 + "s",
              "--delay": Math.random() * 3 + "s",
            } as React.CSSProperties}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <div className="spanish-flag-bar w-24 mx-auto mb-6 rounded-full" />
          <h1 className="font-display text-4xl font-bold text-gold-gradient mb-2">
            Despedida de Soltero
          </h1>
          <p className="text-muted-foreground text-sm tracking-widest uppercase">
            Madrid · 2026
          </p>
          <div className="text-3xl mt-4">🇪🇸</div>
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
              className="w-full bg-card border border-border rounded-xl px-5 py-4 text-center text-xl font-bold tracking-[0.3em] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
            />
          </div>
          <button
            type="submit"
            disabled={verify.isPending || !input.trim()}
            className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl text-lg hover:opacity-90 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {verify.isPending ? "Verifying..." : "Enter 🎉"}
          </button>
        </form>

        <p className="text-center text-muted-foreground text-xs mt-6">
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
