"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { clsx } from "clsx";
import {
  ALL_FRAMEWORKS,
  THINKER_LABELS,
  THINKER_COLORS,
  CATEGORY_LABELS,
  searchFrameworks,
  type Framework,
  type Thinker,
  type Category,
} from "@/lib/frameworks";
import { FrameworkCard } from "@/components/FrameworkCard";
import { FrameworkModal } from "@/components/FrameworkModal";

const THINKERS = Object.keys(THINKER_LABELS) as Thinker[];
const CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];

export function LibraryClient() {
  const [query, setQuery] = useState("");
  const [activeThinker, setActiveThinker] = useState<Thinker | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [selected, setSelected] = useState<Framework | null>(null);

  const frameworks = useMemo(() => {
    let results = query ? searchFrameworks(query) : ALL_FRAMEWORKS;
    if (activeThinker) results = results.filter((f) => f.thinker === activeThinker);
    if (activeCategory) results = results.filter((f) => f.category === activeCategory);
    return results;
  }, [query, activeThinker, activeCategory]);

  return (
    <>
      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A6655]" />
        <input
          type="text"
          placeholder="Search frameworks, topics, or thinkers..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-full border border-[#E0D5C8] bg-white pl-11 pr-4 py-3 text-sm text-[#2C1A0E] placeholder-[#7A6655] focus:outline-none focus:ring-2 focus:ring-[#C4843A]/30 focus:border-[#C4843A] transition-colors"
        />
      </div>

      {/* Thinker filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setActiveThinker(null)}
          className={clsx(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            activeThinker === null
              ? "bg-[#2C1A0E] text-white"
              : "border border-[#E0D5C8] text-[#7A6655] hover:bg-[#F0E9DF]"
          )}
        >
          All
        </button>
        {THINKERS.map((t) => {
          const c = THINKER_COLORS[t];
          return (
            <button
              key={t}
              onClick={() => setActiveThinker(activeThinker === t ? null : t)}
              className={clsx(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                activeThinker === t ? `${c.bg} ${c.text}` : "border border-[#E0D5C8] text-[#7A6655] hover:bg-[#F0E9DF]"
              )}
            >
              {THINKER_LABELS[t]}
            </button>
          );
        })}
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-1.5 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            className={clsx(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              activeCategory === cat
                ? "bg-[#C4843A] text-white"
                : "bg-[#F0E9DF] text-[#8B5E3C] hover:bg-[#E0D5C8]"
            )}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-xs text-[#7A6655] mb-5">
        {frameworks.length} framework{frameworks.length !== 1 ? "s" : ""}
        {activeThinker ? ` by ${THINKER_LABELS[activeThinker]}` : ""}
        {activeCategory ? ` in ${CATEGORY_LABELS[activeCategory]}` : ""}
      </p>

      {/* Grid */}
      {frameworks.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {frameworks.map((f) => (
            <FrameworkCard key={f.id} framework={f} onClick={() => setSelected(f)} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-[#7A6655]">
          <p className="text-lg font-serif mb-2">Nothing found</p>
          <p className="text-sm">Try a different search or remove a filter.</p>
        </div>
      )}

      {selected && <FrameworkModal framework={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
