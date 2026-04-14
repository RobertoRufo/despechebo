import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const CREW_NAMES = ["Roberto", "Jorge", "Sebastian", "Pablo"] as const;
type CrewName = typeof CREW_NAMES[number];

interface Props { pin: string; }

const CATEGORIES = [
  "Documents",
  "Clothing",
  "Toiletries",
  "Electronics",
  "Medications",
  "Other",
];

export default function PackingSection({ pin }: Props) {
  const [newItem, setNewItem] = useState("");
  const [newCategory, setNewCategory] = useState("Other");
  const [filterCat, setFilterCat] = useState<string | null>(null);
  const [myName, setMyName] = useState<CrewName>("Roberto");

  const utils = trpc.useUtils();
  const { data: items = [], isLoading } = trpc.packing.list.useQuery();

  const addItem = trpc.packing.create.useMutation({
    onSuccess: () => { utils.packing.list.invalidate(); setNewItem(""); toast.success("Added!"); },
    onError: (e) => toast.error(e.message),
  });

  const toggleItem = trpc.packing.toggle.useMutation({
    onMutate: async ({ id, checkedBy }) => {
      await utils.packing.list.cancel();
      const prev = utils.packing.list.getData();
      utils.packing.list.setData(undefined, (old) =>
        old?.map(i => i.id === id ? { ...i, checkedBy } : i)
      );
      return { prev };
    },
    onError: (_e, _v, ctx) => { utils.packing.list.setData(undefined, ctx?.prev); },
    onSettled: () => utils.packing.list.invalidate(),
  });

  const deleteItem = trpc.packing.delete.useMutation({
    onSuccess: () => { utils.packing.list.invalidate(); toast.success("Removed!"); },
    onError: (e) => toast.error(e.message),
  });

  const filtered = filterCat ? items.filter(i => i.category === filterCat) : items;
  const packed = filtered.filter(i => i.checkedBy !== null).length;
  const total = filtered.length;
  const pct = total > 0 ? Math.round((packed / total) * 100) : 0;

  const grouped = CATEGORIES.reduce<Record<string, typeof items>>((acc, cat) => {
    const list = filtered.filter(i => i.category === cat);
    if (list.length > 0) acc[cat] = list;
    return acc;
  }, {});

  return (
    <section className="py-16 px-4 bg-secondary/20">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-gold-gradient mb-2">Packing List</h2>
        <p className="text-muted-foreground text-sm mb-6">Shared list — everyone can check off what they've packed 🦳</p>

        {/* Who am I selector */}
        <div className="bg-card border border-border rounded-2xl p-4 mb-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Who are you?</p>
          <div className="flex gap-2 flex-wrap">
            {CREW_NAMES.map(name => (
              <button
                key={name}
                onClick={() => setMyName(name)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                  myName === name
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        {total > 0 && (
          <div className="mb-5">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>{packed} of {total} packed</span>
              <span className="font-semibold text-primary">{pct}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5" style={{ scrollbarWidth: "none" }}>
          <button
            onClick={() => setFilterCat(null)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition ${!filterCat ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`}
          >
            Todo
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCat(filterCat === cat ? null : cat)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition ${filterCat === cat ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Add item form */}
        <div className="bg-card border border-border rounded-2xl p-4 mb-6">
          <p className="text-sm font-semibold text-foreground mb-3">Add an item</p>
          <div className="flex gap-2 flex-col sm:flex-row">
            <input
              value={newItem}
              onChange={e => setNewItem(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && newItem.trim()) {
                  addItem.mutate({ pin, text: newItem.trim(), category: newCategory });
                }
              }}
              placeholder="e.g. Passport, power adapter, sunscreen..."
              className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <select
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              className="bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button
              onClick={() => {
                if (newItem.trim()) addItem.mutate({ pin, text: newItem.trim(), category: newCategory });
              }}
              disabled={!newItem.trim() || addItem.isPending}
              className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition"
            >
              + Add
            </button>
          </div>
        </div>

        {/* Items grouped by category */}
        {isLoading && (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-card rounded-xl animate-pulse" />)}
          </div>
        )}

        {!isLoading && total === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            <div className="text-4xl mb-3">🧳</div>
            <p className="text-sm">The list is empty. Start adding items!</p>
          </div>
        )}

        <div className="space-y-5">
          {Object.entries(grouped).map(([cat, catItems]) => (
            <div key={cat}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{cat}</p>
              <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
                {catItems.map(item => {
                  const isPacked = item.checkedBy !== null;
                  return (
                    <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                      <button
                        onClick={() =>
                          toggleItem.mutate({
                            pin,
                            id: item.id,
                            checkedBy: isPacked ? null : myName,
                          })
                        }
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                          isPacked
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-border hover:border-primary"
                        }`}
                      >
                        {isPacked && <span className="text-xs">✓</span>}
                      </button>
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm transition ${isPacked ? "line-through text-muted-foreground" : "text-foreground"}`}>
                          {item.text}
                        </span>
                        {isPacked && item.checkedBy && (
                          <span className="ml-2 text-xs text-primary/70">· {item.checkedBy}</span>
                        )}
                      </div>
                      <button
                        onClick={() => deleteItem.mutate({ pin, id: item.id })}
                        className="text-muted-foreground hover:text-red-400 transition text-xs px-1.5 py-1 rounded"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
