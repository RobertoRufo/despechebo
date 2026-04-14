import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import type { ItineraryItem } from "../../../drizzle/schema";

const CREW_NAMES = ["Roberto", "Jorge", "Sebastian", "Pablo"] as const;
type CrewName = typeof CREW_NAMES[number];

const DAY_LABELS = [
  { date: "Apr 29", day: "Wednesday", label: "Day 1 · Arrival" },
  { date: "Apr 30", day: "Thursday", label: "Day 2 · Explore" },
  { date: "May 1", day: "Friday", label: "Day 3 · Labor Day ⚠️" },
  { date: "May 2", day: "Saturday", label: "Day 4 · Sightseeing" },
  { date: "May 3", day: "Sunday", label: "Day 5 · Culture" },
  { date: "May 4", day: "Monday", label: "Day 6 · Gran Vía" },
  { date: "May 5", day: "Tuesday", label: "Day 7 · Last Night" },
  { date: "May 6", day: "Wednesday", label: "Day 8 · Departure" },
];

type BadgeType = "reservation_confirmed" | "tbd" | "hot";

function Badge({ badge }: { badge: BadgeType }) {
  if (badge === "reservation_confirmed") return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold bg-green-500/15 text-green-400 border border-green-500/30">
      🟢 Reservación Confirmada
    </span>
  );
  if (badge === "hot") return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold bg-orange-500/15 text-orange-400 border border-orange-500/30">
      🔥 Hot
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium bg-secondary text-muted-foreground border border-border">
      ○ TBD
    </span>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success("Copied!");
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button onClick={copy} className="text-xs text-muted-foreground hover:text-primary transition px-2 py-1 rounded border border-border hover:border-primary">
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

interface LikeBarProps {
  itemId: number;
  pin: string;
}

function LikeBar({ itemId, pin }: LikeBarProps) {
  const utils = trpc.useUtils();
  const { data: likes = [] } = trpc.itinerary.getLikes.useQuery({ itemId });
  const [myName, setMyName] = useState<CrewName>("Roberto");
  const [showPicker, setShowPicker] = useState(false);

  const toggleLike = trpc.itinerary.toggleLike.useMutation({
    onSuccess: () => utils.itinerary.getLikes.invalidate({ itemId }),
    onError: (e) => toast.error(e.message),
  });

  const likedNames = likes.map(l => l.memberName);
  const allLiked = CREW_NAMES.every(n => likedNames.includes(n));

  return (
    <div className="mt-2 flex items-center gap-2 flex-wrap">
      {allLiked && (
        <span className="text-xs font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-full px-2 py-0.5">🔥 Everyone's in!</span>
      )}
      <div className="flex gap-1 flex-wrap">
        {CREW_NAMES.map(name => {
          const liked = likedNames.includes(name);
          return (
            <span key={name} className={`text-xs px-2 py-0.5 rounded-full border transition ${liked ? 'bg-primary/20 text-primary border-primary/40 font-semibold' : 'text-muted-foreground border-border'}`}>
              {liked ? '👍' : ''} {name}
            </span>
          );
        })}
      </div>
      {showPicker ? (
        <div className="flex items-center gap-1 flex-wrap">
          {CREW_NAMES.map(name => (
            <button
              key={name}
              onClick={() => { toggleLike.mutate({ pin, itemId, memberName: name }); setShowPicker(false); }}
              className="text-xs px-2 py-1 rounded-lg border border-primary/40 text-primary hover:bg-primary/10 transition"
            >
              {likedNames.includes(name) ? `Unlike as ${name}` : `Like as ${name}`}
            </button>
          ))}
          <button onClick={() => setShowPicker(false)} className="text-xs px-2 py-1 rounded-lg border border-border text-muted-foreground hover:text-foreground transition">✕</button>
        </div>
      ) : (
        <button
          onClick={() => setShowPicker(true)}
          className="text-xs px-2 py-1 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary transition"
        >
          👍 Like
        </button>
      )}
    </div>
  );
}

interface AddFormProps {
  dayIndex: number;
  pin: string;
  onDone: () => void;
}

function AddItemForm({ dayIndex, pin, onDone }: AddFormProps) {
  const utils = trpc.useUtils();
  const [form, setForm] = useState({
    time: "", title: "", venue: "", address: "", mapsUrl: "",
    badge: "tbd" as BadgeType,
  });

  const create = trpc.itinerary.create.useMutation({
    onSuccess: () => {
      utils.itinerary.list.invalidate();
      toast.success("Activity added!");
      onDone();
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="bg-background border border-primary/30 rounded-xl p-4 mt-3 space-y-3">
      <p className="text-sm font-semibold text-primary">Add new activity</p>
      <div className="grid grid-cols-2 gap-2">
        <input className="col-span-2 bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Title *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
        <input className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Time (e.g. 9:00 PM)" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
        <input className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Venue" value={form.venue} onChange={e => setForm(f => ({ ...f, venue: e.target.value }))} />
        <input className="col-span-2 bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
        <input className="col-span-2 bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Google Maps URL" value={form.mapsUrl} onChange={e => setForm(f => ({ ...f, mapsUrl: e.target.value }))} />
        <select className="col-span-2 bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value as BadgeType }))}>
          <option value="tbd">TBD</option>
          <option value="reservation_confirmed">🟢 Reservación Confirmada</option>
          <option value="hot">🔥 Hot</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => create.mutate({ pin, dayIndex, ...form, sortOrder: 999 })}
          disabled={!form.title || create.isPending}
          className="flex-1 bg-primary text-primary-foreground text-sm font-semibold py-2 rounded-lg hover:opacity-90 disabled:opacity-50 transition"
        >
          {create.isPending ? "Saving..." : "Add activity"}
        </button>
        <button onClick={onDone} className="px-4 py-2 text-sm border border-border rounded-lg text-muted-foreground hover:text-foreground transition">Cancel</button>
      </div>
    </div>
  );
}

interface EditFormProps {
  item: ItineraryItem;
  pin: string;
  onDone: () => void;
}

function EditItemForm({ item, pin, onDone }: EditFormProps) {
  const utils = trpc.useUtils();
  const [form, setForm] = useState({
    time: item.time ?? "",
    title: item.title,
    venue: item.venue ?? "",
    address: item.address ?? "",
    mapsUrl: item.mapsUrl ?? "",
    badge: item.badge as BadgeType,
  });

  const update = trpc.itinerary.update.useMutation({
    onSuccess: () => { utils.itinerary.list.invalidate(); toast.success("Updated!"); onDone(); },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="bg-background border border-primary/30 rounded-xl p-4 mt-2 space-y-3">
      <p className="text-sm font-semibold text-primary">Edit activity</p>
      <div className="grid grid-cols-2 gap-2">
        <input className="col-span-2 bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
        <input className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
        <input className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Venue" value={form.venue} onChange={e => setForm(f => ({ ...f, venue: e.target.value }))} />
        <input className="col-span-2 bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
        <input className="col-span-2 bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Maps URL" value={form.mapsUrl} onChange={e => setForm(f => ({ ...f, mapsUrl: e.target.value }))} />
        <select className="col-span-2 bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value as BadgeType }))}>
          <option value="tbd">TBD</option>
          <option value="reservation_confirmed">🟢 Reservación Confirmada</option>
          <option value="hot">🔥 Hot</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button onClick={() => update.mutate({ pin, id: item.id, ...form })} disabled={!form.title || update.isPending} className="flex-1 bg-primary text-primary-foreground text-sm font-semibold py-2 rounded-lg hover:opacity-90 disabled:opacity-50 transition">
          {update.isPending ? "Saving..." : "Save changes"}
        </button>
        <button onClick={onDone} className="px-4 py-2 text-sm border border-border rounded-lg text-muted-foreground hover:text-foreground transition">Cancel</button>
      </div>
    </div>
  );
}

interface Props { pin: string; }

export default function ItinerarySection({ pin }: Props) {
  const [editMode, setEditMode] = useState(false);
  const [addingDay, setAddingDay] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: items = [], isLoading } = trpc.itinerary.list.useQuery();
  const utils = trpc.useUtils();

  const deleteItem = trpc.itinerary.delete.useMutation({
    onSuccess: () => { utils.itinerary.list.invalidate(); toast.success("Deleted!"); },
    onError: (e) => toast.error(e.message),
  });

  const itemsByDay = DAY_LABELS.map((_, i) =>
    items.filter(item => item.dayIndex === i).sort((a, b) => a.sortOrder - b.sortOrder)
  );

  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gold-gradient">Itinerary</h2>
            <p className="text-muted-foreground text-sm mt-1">April 29 – May 6, 2026 · Madrid</p>
          </div>
          <button
            onClick={() => { setEditMode(e => !e); setAddingDay(null); setEditingId(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition ${editMode ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground hover:border-primary"}`}
          >
            {editMode ? "✓ Done" : "✏️ Edit"}
          </button>
        </div>

        {/* Badge legend */}
        <div className="flex flex-wrap gap-2 mb-6 text-xs">
          <span className="flex items-center gap-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full px-3 py-1">🟢 Reservación Confirmada — table officially booked</span>
          <span className="flex items-center gap-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-full px-3 py-1">🔥 Hot — everyone liked this</span>
          <span className="flex items-center gap-1 bg-secondary text-muted-foreground border border-border rounded-full px-3 py-1">○ TBD — open for the group to decide</span>
        </div>

        {isLoading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-card rounded-2xl animate-pulse" />)}
          </div>
        )}

        <div className="space-y-6">
          {DAY_LABELS.map((day, dayIdx) => (
            <div key={dayIdx} className="bg-card border border-border rounded-2xl overflow-hidden">
              {/* Day header */}
              <div className="bg-gradient-to-r from-card to-secondary px-5 py-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-primary font-bold text-lg font-display">{day.date}</span>
                    <span className="text-muted-foreground text-sm ml-2">· {day.day}</span>
                  </div>
                  <span className="text-sm text-foreground/70 font-medium">{day.label}</span>
                </div>
              </div>

              {/* Activities */}
              <div className="divide-y divide-border">
                {itemsByDay[dayIdx].map(item => (
                  <div key={item.id}>
                    {editingId === item.id ? (
                      <div className="p-4">
                        <EditItemForm item={item} pin={pin} onDone={() => setEditingId(null)} />
                      </div>
                    ) : (
                      <div className="px-5 py-4 flex gap-3">
                        {item.time && (
                          <div className="flex-shrink-0 w-16 text-right">
                            <span className="text-xs text-muted-foreground leading-tight">{item.time}</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2 flex-wrap">
                            <p className="text-foreground font-medium text-sm leading-snug flex-1">{item.title}</p>
                            <Badge badge={item.badge as BadgeType} />
                          </div>
                          {item.venue && <p className="text-muted-foreground text-xs mt-0.5">{item.venue}</p>}
                          {item.address && (
                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                              <span className="text-xs text-muted-foreground truncate max-w-[200px]">{item.address}</span>
                              <CopyButton text={item.address} />
                              {item.mapsUrl && (
                                <a href={item.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">📍 Maps</a>
                              )}
                            </div>
                          )}
                          <LikeBar itemId={item.id} pin={pin} />
                        </div>
                        {editMode && (
                          <div className="flex-shrink-0 flex gap-1">
                            <button onClick={() => setEditingId(item.id)} className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary transition text-xs">✏️</button>
                            <button onClick={() => { if (confirm("Remove this activity?")) deleteItem.mutate({ pin, id: item.id }); }} className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-red-400 hover:border-red-400 transition text-xs">🗑</button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {itemsByDay[dayIdx].length === 0 && (
                  <div className="px-5 py-4 text-muted-foreground text-sm italic">No activities yet — add one below!</div>
                )}
              </div>

              {/* Add activity button */}
              {editMode && (
                <div className="px-5 pb-4">
                  {addingDay === dayIdx ? (
                    <AddItemForm dayIndex={dayIdx} pin={pin} onDone={() => setAddingDay(null)} />
                  ) : (
                    <button onClick={() => setAddingDay(dayIdx)} className="w-full mt-3 py-2.5 border border-dashed border-primary/40 rounded-xl text-primary/70 text-sm hover:border-primary hover:text-primary transition">
                      + Add activity
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
