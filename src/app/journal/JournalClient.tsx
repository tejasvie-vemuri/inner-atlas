"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { getDailyFramework, getFrameworkById, THINKER_LABELS, THINKER_COLORS } from "@/lib/frameworks";
import type { Framework } from "@/lib/frameworks";
import { Save, Clock, Flame } from "lucide-react";
import { clsx } from "clsx";

interface JournalEntry {
  id: string;
  framework_id: string | null;
  prompt_text: string;
  content: string;
  created_at: string;
}

interface JournalClientProps {
  initialFrameworkId?: string;
}

export function JournalClient({ initialFrameworkId }: JournalClientProps) {
  const [framework, setFramework] = useState<Framework>(() =>
    initialFrameworkId ? (getFrameworkById(initialFrameworkId) ?? getDailyFramework()) : getDailyFramework()
  );
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(null);

  const supabase = createClient();
  const colors = THINKER_COLORS[framework.thinker];

  const loadEntries = useCallback(async () => {
    const { data } = await supabase
      .from("journal_entries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) setEntries(data);
    setLoadingEntries(false);
  }, [supabase]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  async function saveEntry() {
    if (!content.trim()) return;
    setSaving(true);

    if (currentEntryId) {
      await supabase
        .from("journal_entries")
        .update({ content })
        .eq("id", currentEntryId);
    } else {
      const { data } = await supabase
        .from("journal_entries")
        .insert({
          framework_id: framework.id,
          prompt_text: framework.prompt,
          content,
        })
        .select()
        .single();
      if (data) setCurrentEntryId(data.id);
    }

    setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    setSaving(false);
    loadEntries();
  }

  function loadExistingEntry(entry: JournalEntry) {
    const f = entry.framework_id ? (getFrameworkById(entry.framework_id) ?? getDailyFramework()) : getDailyFramework();
    setFramework(f);
    setContent(entry.content);
    setCurrentEntryId(entry.id);
    setSavedAt(null);
  }

  function newEntry() {
    setFramework(getDailyFramework());
    setContent("");
    setCurrentEntryId(null);
    setSavedAt(null);
  }

  const streakCount = entries.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main editor */}
      <div className="lg:col-span-2 space-y-5">
        {/* Framework prompt */}
        <div className="rounded-2xl border border-[#E0D5C8] bg-white p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className={clsx("rounded-full px-3 py-0.5 text-xs font-medium", colors.bg, colors.text)}>
              {THINKER_LABELS[framework.thinker]}
            </span>
            <span className="text-xs text-[#7A6655]">{framework.title}</span>
          </div>
          <div className="rounded-xl bg-[#FAF6F1] border border-[#E0D5C8] p-4">
            <p className="text-xs font-medium text-[#C4843A] uppercase tracking-wider mb-1.5">Today&apos;s Prompt</p>
            <p className="text-sm text-[#2C1A0E] leading-relaxed">{framework.prompt}</p>
          </div>
        </div>

        {/* Editor */}
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing... let it be messy, honest, and yours."
            rows={14}
            className="w-full rounded-2xl border border-[#E0D5C8] bg-white px-6 py-5 text-sm text-[#2C1A0E] placeholder-[#7A6655] focus:outline-none focus:ring-2 focus:ring-[#C4843A]/30 focus:border-[#C4843A] resize-none transition-colors leading-8"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {savedAt && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-600">
                <Clock size={12} /> Saved at {savedAt}
              </span>
            )}
          </div>
          <button
            onClick={saveEntry}
            disabled={saving || !content.trim()}
            className="flex items-center gap-2 rounded-full bg-[#C4843A] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#A36A2A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save size={14} />
            {saving ? "Saving..." : currentEntryId ? "Update" : "Save Entry"}
          </button>
        </div>
      </div>

      {/* Sidebar: past entries */}
      <div className="space-y-4">
        {/* Streak */}
        <div className="rounded-2xl border border-[#E0D5C8] bg-white p-5">
          <div className="flex items-center gap-2 mb-1">
            <Flame size={16} className="text-[#C4843A]" />
            <span className="text-sm font-medium text-[#2C1A0E]">{streakCount} entries</span>
          </div>
          <p className="text-xs text-[#7A6655]">Keep writing to build your reflection practice.</p>
        </div>

        <button
          onClick={newEntry}
          className="w-full rounded-full border border-[#E0D5C8] px-4 py-2 text-sm text-[#2C1A0E] hover:bg-[#F0E9DF] transition-colors"
        >
          + New Entry
        </button>

        {/* Past entries */}
        <div>
          <p className="text-xs text-[#7A6655] uppercase tracking-wider mb-3">Past Entries</p>
          {loadingEntries ? (
            <p className="text-xs text-[#7A6655]">Loading...</p>
          ) : entries.length === 0 ? (
            <p className="text-xs text-[#7A6655]">No entries yet. Write your first one!</p>
          ) : (
            <div className="space-y-2">
              {entries.map((entry) => {
                const f = entry.framework_id ? getFrameworkById(entry.framework_id) : null;
                const c = f ? THINKER_COLORS[f.thinker] : null;
                return (
                  <button
                    key={entry.id}
                    onClick={() => loadExistingEntry(entry)}
                    className={clsx(
                      "w-full text-left rounded-xl border p-3.5 transition-colors",
                      currentEntryId === entry.id
                        ? "border-[#C4843A] bg-amber-50"
                        : "border-[#E0D5C8] bg-white hover:bg-[#F0E9DF]"
                    )}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      {f && c && (
                        <span className={clsx("rounded-full px-2 py-0.5 text-xs", c.bg, c.text)}>
                          {f.title}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#7A6655] line-clamp-2">{entry.content || "Empty entry"}</p>
                    <p className="text-xs text-[#7A6655] mt-1.5">
                      {new Date(entry.created_at).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
