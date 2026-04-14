function FlightLeg({ from, to, flight, aircraft, time, date, terminal }: {
  from: string; to: string; flight: string; aircraft: string;
  time: string; date: string; terminal?: string;
}) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="text-center min-w-[48px]">
        <p className="font-bold text-foreground text-base">{from}</p>
      </div>
      <div className="flex-1 flex items-center gap-2">
        <div className="h-px flex-1 bg-border" />
        <div className="text-center">
          <p className="text-xs font-bold text-primary">{flight}</p>
          <p className="text-xs text-muted-foreground">{aircraft}</p>
        </div>
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="text-center min-w-[48px]">
        <p className="font-bold text-foreground text-base">{to}</p>
      </div>
    </div>
  );
}

function FlightCard({ direction, route, legs, departs, arrives, departDate, arriveDate, duration, departTerminal, arriveTerminal }: {
  direction: string; route: string;
  legs: { from: string; to: string; flight: string; aircraft: string }[];
  departs: string; arrives: string; departDate: string; arriveDate: string;
  duration: string; departTerminal?: string; arriveTerminal?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-primary/10 to-card px-5 py-3 border-b border-border flex items-center justify-between">
        <div>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{direction}</span>
          <p className="font-display font-bold text-lg text-foreground">{route}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Duration</p>
          <p className="font-semibold text-primary text-sm">{duration}</p>
        </div>
      </div>
      <div className="px-5 py-4 space-y-1">
        {/* Depart / Arrive */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-2xl font-bold text-foreground">{departs}</p>
            <p className="text-xs text-muted-foreground">{departDate}</p>
            {departTerminal && <p className="text-xs text-muted-foreground">{departTerminal}</p>}
          </div>
          <div className="flex flex-col items-center px-4">
            <span className="text-xl">✈️</span>
            <div className="h-px w-16 bg-border mt-1" />
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{arrives}</p>
            <p className="text-xs text-muted-foreground">{arriveDate}</p>
            {arriveTerminal && <p className="text-xs text-muted-foreground">{arriveTerminal}</p>}
          </div>
        </div>
        {/* Legs */}
        <div className="border-t border-border pt-3 space-y-1">
          {legs.map((leg, i) => (
            <FlightLeg key={i} {...leg} time="" date="" />
          ))}
        </div>
        <p className="text-xs text-muted-foreground pt-1">✦ Delta · Layover included · Plane change</p>
      </div>
    </div>
  );
}

export default function FlightsSection() {
  return (
    <section className="py-16 px-4 bg-secondary/20">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-gold-gradient mb-2">Flights</h2>
        <p className="text-muted-foreground text-sm mb-8">Delta Air Lines · Austin ↔ Madrid</p>

        <div className="space-y-5">
          <FlightCard
            direction="Outbound"
            route="AUS → ATL → MAD"
            departs="5:06 PM"
            arrives="12:15 PM"
            departDate="Tue, April 28"
            arriveDate="Wed, April 29"
            duration="12h 9m"
            departTerminal="Austin-Bergstrom (AUS)"
            arriveTerminal="Madrid T1 (MAD)"
            legs={[
              { from: "AUS", to: "ATL", flight: "DL1397", aircraft: "Airbus A321neo" },
              { from: "ATL", to: "MAD", flight: "DL0108", aircraft: "Airbus A330-300" },
            ]}
          />
          <FlightCard
            direction="Return"
            route="MAD → ATL → AUS"
            departs="12:45 PM"
            arrives="7:46 PM"
            departDate="Wed, May 6"
            arriveDate="Wed, May 6"
            duration="14h 1m"
            departTerminal="Madrid T1 (MAD)"
            arriveTerminal="Austin-Bergstrom (AUS)"
            legs={[
              { from: "MAD", to: "ATL", flight: "DL0109", aircraft: "Airbus A330-300" },
              { from: "ATL", to: "AUS", flight: "DL1060", aircraft: "Airbus A321" },
            ]}
          />
        </div>

        <div className="mt-5 bg-card border border-border rounded-xl px-5 py-3 flex items-center gap-3">
          <span className="text-xl">💡</span>
          <p className="text-sm text-muted-foreground">Check in online 24h before departure. Layover in Atlanta (ATL) — allow time for customs on the return.</p>
        </div>
      </div>
    </section>
  );
}
