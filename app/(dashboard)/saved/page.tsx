"use client";

import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { Bookmark, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { IdeaCard } from "@/components/IdeaCard";
import { getSavedIds, getSavedEntry, unsaveIdea, updateIdeaStatus, type IdeaStatus } from "@/lib/saved-ideas";
import type { Idea } from "@/lib/types";

type SortKey = "newest" | "oldest" | "complexity-asc" | "complexity-desc";
type FilterStatus = "ALL" | IdeaStatus;

interface SavedIdeaEntry { idea: Idea; status: IdeaStatus; savedAt: string; }

const STATUS_TABS: { value: FilterStatus; label: string }[] = [
  { value: "ALL",         label: "All" },
  { value: "SAVED",       label: "Saved" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED",   label: "Completed" },
  { value: "ABANDONED",   label: "Abandoned" },
];

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest",          label: "Newest first" },
  { value: "oldest",          label: "Oldest first" },
  { value: "complexity-desc", label: "Hardest first" },
  { value: "complexity-asc",  label: "Easiest first" },
];

function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl p-5 space-y-4 overflow-hidden">
      <div className="h-4 shimmer rounded-lg w-2/3" />
      <div className="h-3 shimmer rounded w-full" />
      <div className="h-3 shimmer rounded w-4/5" />
      <div className="h-10 shimmer rounded-xl w-full" />
    </div>
  );
}

export default function SavedPage() {
  const [entries, setEntries] = useState<SavedIdeaEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<FilterStatus>("ALL");
  const [sort, setSort] = useState<SortKey>("newest");

  useEffect(() => {
    const ids = getSavedIds();
    if (!ids.length) { setLoading(false); return; }

    Promise.all(
      ids.map((id) =>
        fetch(`/api/ideas/${id}`)
          .then((r) => r.json())
          .then((d) => {
            const entry = getSavedEntry(id);
            return d.idea ? ({ idea: d.idea as Idea, status: entry?.status ?? "SAVED", savedAt: entry?.savedAt ?? "" }) : null;
          })
          .catch(() => null)
      )
    )
      .then((res) => setEntries(res.filter(Boolean) as SavedIdeaEntry[]))
      .finally(() => setLoading(false));
  }, []);

  function handleUnsave(id: string) {
    unsaveIdea(id);
    setEntries((prev) => prev.filter((e) => e.idea.id !== id));
    toast.success("Removed from Idea Bag");
  }

  function handleStatusChange(id: string, status: IdeaStatus) {
    updateIdeaStatus(id, status);
    setEntries((prev) => prev.map((e) => e.idea.id === id ? { ...e, status } : e));
    toast.success(`Status updated to ${status.replace("_", " ").toLowerCase()}`);
  }

  async function handleExpand(idea: Idea): Promise<Idea> {
    const res = await fetch(`/api/ideas/${idea.id}/expand`, { method: "POST" });
    if (!res.ok) throw new Error();
    const data = await res.json();
    setEntries((prev) => prev.map((e) => e.idea.id === idea.id ? { ...e, idea: data.idea } : e));
    return data.idea;
  }

  const filtered = useMemo(() => {
    let list = [...entries];
    if (activeStatus !== "ALL") list = list.filter((e) => e.status === activeStatus);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((e) =>
        e.idea.title.toLowerCase().includes(q) ||
        e.idea.description.toLowerCase().includes(q) ||
        e.idea.categories.some((c) => c.toLowerCase().includes(q))
      );
    }
    list.sort((a, b) => {
      if (sort === "newest") return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
      if (sort === "oldest") return new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime();
      if (sort === "complexity-desc") return b.idea.complexityScore - a.idea.complexityScore;
      return a.idea.complexityScore - b.idea.complexityScore;
    });
    return list;
  }, [entries, activeStatus, search, sort]);

  const counts: Record<string, number> = useMemo(() => {
    const c: Record<string, number> = { ALL: entries.length };
    entries.forEach((e) => { c[e.status] = (c[e.status] ?? 0) + 1; });
    return c;
  }, [entries]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-32 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Idea Bag</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {entries.length} saved {entries.length === 1 ? "idea" : "ideas"} — stored locally in your browser.
          </p>
        </div>
      </div>

      {entries.length > 0 && (
        <>
          {/* Status tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
            {STATUS_TABS.filter((t) => counts[t.value]).map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setActiveStatus(value)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeStatus === value
                    ? "btn-glass-primary"
                    : "btn-glass-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
                <span className={`text-xs rounded-full px-1.5 py-0.5 ${activeStatus === value ? "bg-white/20 text-white" : "glass-badge text-muted-foreground"}`}>
                  {counts[value] ?? 0}
                </span>
              </button>
            ))}
          </div>

          {/* Search + sort */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by title, description, or category…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm glass-panel rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="relative">
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="pl-9 pr-8 py-2 text-sm glass-panel rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground appearance-none cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(({ idea, status: st }) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              isSaved
              status={st}
              onUnsave={handleUnsave}
              onStatusChange={handleStatusChange}
              onExpand={handleExpand}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-8 h-8 text-muted-foreground" />
          </div>
          {entries.length === 0 ? (
            <>
              <h3 className="text-lg font-semibold text-foreground mb-2">Your Idea Bag is empty</h3>
              <p className="text-sm text-muted-foreground mb-6">Generate ideas and save the ones you like.</p>
              <Link
                href="/generate"
                className="inline-flex items-center gap-2 btn-glass-primary px-5 py-2.5 rounded-xl text-sm font-medium"
              >
                Generate ideas
              </Link>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
              <p className="text-sm text-muted-foreground">Try a different filter or search term.</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
