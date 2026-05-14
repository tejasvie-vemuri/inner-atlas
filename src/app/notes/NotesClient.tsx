"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { ALL_FRAMEWORKS, THINKER_LABELS, THINKER_COLORS } from "@/lib/frameworks";
import { Plus, Trash2, Save, Tag, Clock } from "lucide-react";
import { clsx } from "clsx";

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  linked_framework_id: string | null;
  created_at: string;
  updated_at: string;
}

export function NotesClient() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("Untitled");
  const [content, setContent] = useState("");
  const [linkedFramework, setLinkedFramework] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const loadNotes = useCallback(async () => {
    const { data } = await supabase
      .from("notes")
      .select("*")
      .order("updated_at", { ascending: false });
    if (data) setNotes(data);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  function openNote(note: Note) {
    setActiveNote(note);
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags ?? []);
    setLinkedFramework(note.linked_framework_id ?? "");
    setSavedAt(null);
  }

  function newNote() {
    setActiveNote(null);
    setTitle("Untitled");
    setContent("");
    setTags([]);
    setLinkedFramework("");
    setSavedAt(null);
  }

  async function saveNote() {
    if (saving) return;
    setSaving(true);

    const payload = {
      title: title.trim() || "Untitled",
      content,
      tags,
      linked_framework_id: linkedFramework || null,
    };

    if (activeNote) {
      await supabase.from("notes").update(payload).eq("id", activeNote.id);
    } else {
      const { data } = await supabase.from("notes").insert(payload).select().single();
      if (data) setActiveNote(data);
    }

    setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    setSaving(false);
    loadNotes();
  }

  async function deleteNote(id: string) {
    await supabase.from("notes").delete().eq("id", id);
    if (activeNote?.id === id) newNote();
    loadNotes();
  }

  function addTag(e: React.KeyboardEvent) {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase();
      if (!tags.includes(tag)) setTags([...tags, tag]);
      setTagInput("");
    }
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags)));
  const filteredNotes = filterTag ? notes.filter((n) => n.tags.includes(filterTag)) : notes;

  const linkedFw = linkedFramework ? ALL_FRAMEWORKS.find((f) => f.id === linkedFramework) : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sidebar: notes list */}
      <div className="space-y-3">
        <button
          onClick={newNote}
          className="w-full flex items-center justify-center gap-2 rounded-full bg-[#C4843A] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#A36A2A] transition-colors"
        >
          <Plus size={15} /> New Note
        </button>

        {/* Tag filter */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setFilterTag(null)}
              className={clsx(
                "rounded-full px-2.5 py-0.5 text-xs transition-colors",
                filterTag === null ? "bg-[#2C1A0E] text-white" : "bg-[#F0E9DF] text-[#7A6655] hover:bg-[#E0D5C8]"
              )}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setFilterTag(filterTag === tag ? null : tag)}
                className={clsx(
                  "rounded-full px-2.5 py-0.5 text-xs transition-colors",
                  filterTag === tag ? "bg-[#C4843A] text-white" : "bg-[#F0E9DF] text-[#8B5E3C] hover:bg-[#E0D5C8]"
                )}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Notes list */}
        {loading ? (
          <p className="text-xs text-[#7A6655]">Loading...</p>
        ) : filteredNotes.length === 0 ? (
          <p className="text-xs text-[#7A6655]">No notes yet. Create your first one!</p>
        ) : (
          <div className="space-y-2">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className={clsx(
                  "group rounded-xl border p-4 cursor-pointer transition-colors",
                  activeNote?.id === note.id
                    ? "border-[#C4843A] bg-amber-50"
                    : "border-[#E0D5C8] bg-white hover:bg-[#F0E9DF]"
                )}
                onClick={() => openNote(note)}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-[#2C1A0E] line-clamp-1">{note.title}</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded text-[#7A6655] hover:text-red-600 transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <p className="text-xs text-[#7A6655] line-clamp-2 mt-0.5">{note.content || "Empty note"}</p>
                {note.tags.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {note.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-full bg-[#F0E9DF] px-2 py-0.5 text-xs text-[#8B5E3C]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-[#7A6655] mt-2">
                  {new Date(note.updated_at).toLocaleDateString([], { month: "short", day: "numeric" })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Editor */}
      <div className="lg:col-span-2 space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className="w-full font-serif text-2xl font-bold text-[#2C1A0E] bg-transparent border-none outline-none placeholder-[#E0D5C8]"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write freely — brainstorm, reflect, connect ideas..."
          rows={12}
          className="w-full rounded-2xl border border-[#E0D5C8] bg-white px-6 py-5 text-sm text-[#2C1A0E] placeholder-[#7A6655] focus:outline-none focus:ring-2 focus:ring-[#C4843A]/30 focus:border-[#C4843A] resize-none transition-colors leading-8"
        />

        {/* Tags */}
        <div className="rounded-xl border border-[#E0D5C8] bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <Tag size={13} className="text-[#7A6655]" />
            <span className="text-xs font-medium text-[#7A6655]">Tags</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => removeTag(tag)}
                className="rounded-full bg-[#F0E9DF] border border-[#E0D5C8] px-2.5 py-0.5 text-xs text-[#8B5E3C] hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
              >
                #{tag} ×
              </button>
            ))}
          </div>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={addTag}
            placeholder="Type a tag and press Enter"
            className="w-full text-xs text-[#2C1A0E] bg-transparent outline-none placeholder-[#7A6655]"
          />
        </div>

        {/* Link to framework */}
        <div className="rounded-xl border border-[#E0D5C8] bg-white p-4">
          <p className="text-xs font-medium text-[#7A6655] mb-2">Link to a Framework</p>
          <select
            value={linkedFramework}
            onChange={(e) => setLinkedFramework(e.target.value)}
            className="w-full text-sm text-[#2C1A0E] bg-transparent outline-none cursor-pointer"
          >
            <option value="">None</option>
            {ALL_FRAMEWORKS.map((f) => (
              <option key={f.id} value={f.id}>
                {THINKER_LABELS[f.thinker]} — {f.title}
              </option>
            ))}
          </select>
          {linkedFw && (
            <p className="text-xs text-[#7A6655] mt-2 italic">
              &ldquo;{linkedFw.summary}&rdquo;
            </p>
          )}
        </div>

        {/* Save bar */}
        <div className="flex items-center justify-between">
          {savedAt ? (
            <span className="flex items-center gap-1.5 text-xs text-emerald-600">
              <Clock size={12} /> Saved at {savedAt}
            </span>
          ) : <span />}
          <button
            onClick={saveNote}
            disabled={saving}
            className="flex items-center gap-2 rounded-full bg-[#C4843A] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#A36A2A] disabled:opacity-50 transition-colors"
          >
            <Save size={14} />
            {saving ? "Saving..." : activeNote ? "Update" : "Save Note"}
          </button>
        </div>
      </div>
    </div>
  );
}
