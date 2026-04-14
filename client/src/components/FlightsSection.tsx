interface Leg {
  from: string;
  fromCity: string;
  to: string;
  toCity: string;
  flight: string;
  aircraft: string;
  departs: string;
  arrives: string;
  departDate: string;
  arriveDate: string;
  duration: string;
  departTerminal?: string;
  arriveTerminal?: string;
}

interface Lounge {
  name: string;
  access: string;
  note: string;
  accessible: boolean;
}

interface FlightCardProps {
  direction: string;
  route: string;
  totalDuration: string;
  legs: Leg[];
  layoverDuration: string;
  layoverAirport: string;
  lounges: Lounge[];
}

function LegCard({ leg, isFirst }: { leg: Leg; isFirst: boolean }) {
  return (
    <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-primary uppercase tracking-wider">{leg.flight}</span>
        <span className="text-xs text-muted-foreground">{leg.aircraft}</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        {/* Departure */}
        <div className="text-left">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-lg">{isFirst ? "🛫" : "🛫"}</span>
            <span className="font-bold text-foreground text-xl">{leg.departs}</span>
          </div>
          <p className="text-xs text-muted-foreground">{leg.departDate}</p>
          <p className="font-semibold text-foreground text-sm">{leg.from}</p>
          <p className="text-xs text-muted-foreground">{leg.fromCity}</p>
          {leg.departTerminal && <p className="text-xs text-muted-foreground/70">{leg.departTerminal}</p>}
        </div>

        {/* Duration arrow */}
        <div className="flex-1 flex flex-col items-center px-2">
          <span className="text-xs text-muted-foreground mb-1">{leg.duration}</span>
          <div className="w-full flex items-center gap-1">
            <div className="flex-1 h-px bg-border" />
            <span className="text-primary text-xs">✈</span>
            <div className="flex-1 h-px bg-border" />
          </div>
        </div>

        {/* Arrival */}
        <div className="text-right">
          <div className="flex items-center gap-1.5 mb-0.5 justify-end">
            <span className="font-bold text-primary text-xl">{leg.arrives}</span>
            <span className="text-lg">🛬</span>
          </div>
          <p className="text-xs text-muted-foreground">{leg.arriveDate}</p>
          <p className="font-semibold text-foreground text-sm">{leg.to}</p>
          <p className="text-xs text-muted-foreground">{leg.toCity}</p>
          {leg.arriveTerminal && <p className="text-xs text-muted-foreground/70">{leg.arriveTerminal}</p>}
        </div>
      </div>
    </div>
  );
}

function LayoverBadge({ duration, airport, lounges }: { duration: string; airport: string; lounges: Lounge[] }) {
  return (
    <div className="relative flex flex-col items-center my-1">
      <div className="w-px h-3 bg-border" />
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 w-full">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">🔄</span>
            <span className="text-xs font-semibold text-foreground">Layover at {airport}</span>
          </div>
              <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">{duration}</span>
        </div>
        <div className="space-y-1.5">
          {lounges.map((lounge, i) => (
            <div key={i} className={`flex items-start gap-2 text-xs rounded-lg px-2 py-1.5 ${lounge.accessible ? 'bg-green-50 border border-green-200' : 'bg-stone-100 border border-stone-200'}`}>
              <span className="mt-0.5 flex-shrink-0">{lounge.accessible ? '✅' : '⚠️'}</span>
              <div>
                <span className={`font-semibold ${lounge.accessible ? 'text-green-700' : 'text-stone-500'}`}>{lounge.name}</span>
                <span className="text-muted-foreground"> · {lounge.access}</span>
                {lounge.note && <p className="text-muted-foreground/70 mt-0.5">{lounge.note}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-px h-3 bg-border" />
    </div>
  );
}

function FlightCard({ direction, route, totalDuration, legs, layoverDuration, layoverAirport, lounges }: FlightCardProps) {
  return (
    <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm shadow-red-900/5">
      <div className="bg-gradient-to-r from-red-600 to-red-700 px-5 py-3 border-b border-red-700 flex items-center justify-between">
        <div>
          <span className="text-xs text-red-200 uppercase tracking-widest">{direction}</span>
          <p className="font-display font-bold text-lg text-white">{route}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-red-200">Total Duration</p>
          <p className="font-semibold text-yellow-300 text-sm">{totalDuration}</p>
        </div>
      </div>
      <div className="px-4 py-4 space-y-1">
        <LegCard leg={legs[0]} isFirst={true} />
        <LayoverBadge duration={layoverDuration} airport={layoverAirport} lounges={lounges} />
        <LegCard leg={legs[1]} isFirst={false} />
      </div>
      <div className="px-4 pb-4">
        <p className="text-xs text-muted-foreground">Delta Air Lines · Delta Main Basic (E) · Plane change at {layoverAirport}</p>
      </div>
    </div>
  );
}

const ATL_LOUNGES_OUTBOUND: Lounge[] = [
  {
    name: "Delta Sky Club (ATL)",
    access: "Not accessible",
    note: "Delta Main Basic fare does not include Sky Club access.",
    accessible: false,
  },
  {
    name: "Centurion Lounge ATL",
    access: "Amex Platinum / Centurion card",
    note: "International Terminal, Concourse F. Open to cardholders + 2 guests.",
    accessible: true,
  },
  {
    name: "The Club ATL",
    access: "Priority Pass / $45 day pass",
    note: "Domestic Terminal South. 1h 27m layover — enough time to grab a drink.",
    accessible: true,
  },
];

const ATL_LOUNGES_RETURN: Lounge[] = [
  {
    name: "Delta Sky Club (ATL)",
    access: "Not accessible",
    note: "Delta Main Basic fare does not include Sky Club access.",
    accessible: false,
  },
  {
    name: "Centurion Lounge ATL",
    access: "Amex Platinum / Centurion card",
    note: "International Terminal, Concourse F. 1h 45m layover — comfortable connection.",
    accessible: true,
  },
  {
    name: "The Club ATL",
    access: "Priority Pass / $45 day pass",
    note: "Domestic Terminal South. Good option if you have Priority Pass.",
    accessible: true,
  },
];

export default function FlightsSection() {
  return (
    <section className="py-16 px-4 bg-stone-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-black text-red-700 mb-2">✈️ Flights</h2>
        <p className="text-muted-foreground text-sm mb-8">Delta Air Lines · Austin ↔ Madrid · All times local</p>

        <div className="space-y-6">
          <FlightCard
            direction="Outbound"
            route="AUS → ATL → MAD"
            totalDuration="12h 9m"
            layoverDuration="1h 27m"
            layoverAirport="ATL"
            lounges={ATL_LOUNGES_OUTBOUND}
            legs={[
              {
                from: "AUS", fromCity: "Austin, TX",
                to: "ATL", toCity: "Atlanta, GA",
                flight: "DL1397", aircraft: "Airbus A321neo",
                departs: "5:06 PM", arrives: "8:28 PM",
                departDate: "Tue, Apr 28", arriveDate: "Tue, Apr 28",
                duration: "2h 22m",
                departTerminal: "Terminal TBD",
                arriveTerminal: "Domestic Term-South",
              },
              {
                from: "ATL", fromCity: "Atlanta, GA",
                to: "MAD", toCity: "Madrid, Spain",
                flight: "DL0108", aircraft: "Airbus A330-300",
                departs: "9:55 PM", arrives: "12:15 PM",
                departDate: "Tue, Apr 28", arriveDate: "Wed, Apr 29",
                duration: "8h 20m",
                departTerminal: "International Term",
                arriveTerminal: "Terminal 1",
              },
            ]}
          />

          <FlightCard
            direction="Return"
            route="MAD → ATL → AUS"
            totalDuration="14h 1m"
            layoverDuration="1h 45m"
            layoverAirport="ATL"
            lounges={ATL_LOUNGES_RETURN}
            legs={[
              {
                from: "MAD", fromCity: "Madrid, Spain",
                to: "ATL", toCity: "Atlanta, GA",
                flight: "DL0109", aircraft: "Airbus A330-300",
                departs: "12:45 PM", arrives: "4:27 PM",
                departDate: "Wed, May 6", arriveDate: "Wed, May 6",
                duration: "9h 42m",
                departTerminal: "Terminal 1",
                arriveTerminal: "International Term",
              },
              {
                from: "ATL", fromCity: "Atlanta, GA",
                to: "AUS", toCity: "Austin, TX",
                flight: "DL1060", aircraft: "Airbus A321",
                departs: "6:12 PM", arrives: "7:46 PM",
                departDate: "Wed, May 6", arriveDate: "Wed, May 6",
                duration: "2h 34m",
                departTerminal: "Domestic Term-South",
                arriveTerminal: "Terminal TBD",
              },
            ]}
          />
        </div>

        <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 flex items-start gap-3">
          <span className="text-xl mt-0.5">💡</span>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Check in online 24h before departure. On the return, allow extra time for customs at ATL — international arrivals can be slow.</p>
            <p>Delta Main Basic (E) does not include Sky Club access. Centurion Lounge requires Amex Platinum or Centurion card.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
