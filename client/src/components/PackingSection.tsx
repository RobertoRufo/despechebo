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
    <section className="py-16 px-4 bg-amber-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-black text-red-700 mb-2">🧳 Packing List</h2>
        <p className="text-stone-500 text-sm mb-6">Shared list — everyone can check off what they've packed</p>

        {/* Who am I selector */}
        <div className="bg-white border border-stone-200 rounded-2xl p-4 mb-5 shadow-sm">
          <p className="text-xs text-stone-400 uppercase tracking-wider mb-2 font-semibold">Who are you?</p>
          <div className="flex gap-2 flex-wrap">
            {CREW_NAMES.map(name => (
              <button
                key={name}
                onClick={() => setMyName(name)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition ${
                  myName === name
                    ? "bg-red-600 text-white border-red-600"
                    : "border-stone-200 text-stone-500 hover:border-red-300 hover:text-red-700"
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
            <div className="flex justify-between text-xs text-stone-500 mb-1">
              <span>{packed} of {total} packed</span>
              <span className="font-bold text-red-600">{pct}%</span>
            </div>
            <div className="h-2.5 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5" style={{ scrollbarWidth: "none" }}>
          <button
            onClick={() => setFilterCat(null)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${!filterCat ? "bg-red-600 text-white border-red-600" : "border-stone-200 text-stone-500 hover:border-red-300 hover:text-red-700"}`}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCat(filterCat === cat ? null : cat)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${filterCat === cat ? "bg-red-600 text-white border-red-600" : "border-stone-200 text-stone-500 hover:border-red-300 hover:text-red-700"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Add item form */}
        <div className="bg-white border border-stone-200 rounded-2xl p-4 mb-6 shadow-sm">
          <p className="text-sm font-bold text-stone-700 mb-3">Add an item</p>
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
              className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <select
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button
              onClick={() => {
                if (newItem.trim()) addItem.mutate({ pin, text: newItem.trim(), category: newCategory });
              }}
              disabled={!newItem.trim() || addItem.isPending}
              className="bg-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-red-700 disabled:opacity-50 transition"
            >
              + Add
            </button>
          </div>
        </div>

        {/* Items grouped by category */}
        {isLoading && (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-stone-100 rounded-xl animate-pulse" />)}
          </div>
        )}

        {!isLoading && total === 0 && (
          <div className="text-center py-10 text-stone-400">
            <div className="text-4xl mb-3">🧳</div>
            <p className="text-sm">The list is empty. Start adding items!</p>
          </div>
        )}

        <div className="space-y-5">
          {Object.entries(grouped).map(([cat, catItems]) => (
            <div key={cat}>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">{cat}</p>
              <div className="bg-white border border-stone-200 rounded-2xl divide-y divide-stone-100 overflow-hidden shadow-sm">
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
                            ? "bg-red-500 border-red-500 text-white"
                            : "border-stone-300 hover:border-red-400"
                        }`}
                      >
                        {isPacked && <span className="text-xs">✓</span>}
                      </button>
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm transition ${isPacked ? "line-through text-stone-400" : "text-stone-800"}`}>
                          {item.text}
                        </span>
                        {isPacked && item.checkedBy && (
                          <span className="ml-2 text-xs text-red-400 font-medium">· {item.checkedBy}</span>
                        )}
                      </div>
                      <button
                        onClick={() => deleteItem.mutate({ pin, id: item.id })}
                        className="text-stone-300 hover:text-red-400 transition text-xs px-1.5 py-1 rounded"
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
