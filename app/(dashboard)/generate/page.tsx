"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { GenerateForm } from "@/components/GenerateForm";
import { IdeaCard } from "@/components/IdeaCard";
import { getSavedIds, saveIdea, unsaveIdea } from "@/lib/saved-ideas";
import type { Idea, GenerateRequest } from "@/lib/types";

function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-4 overflow-hidden">
      <div className="space-y-2">
        <div className="h-4 shimmer rounded-lg w-3/4" />
        <div className="flex gap-2">
          <div className="h-5 shimmer rounded-full w-20" />
          <div className="h-5 shimmer rounded-full w-16" />
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="h-3 shimmer rounded w-full" />
        <div className="h-3 shimmer rounded w-5/6" />
        <div className="h-3 shimmer rounded w-4/6" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[1,2,3].map((i) => <div key={i} className="h-3 shimmer rounded w-full" />)}
      </div>
      <div className="flex gap-1.5">
        {[1,2,3].map((i) => <div key={i} className="h-5 shimmer rounded-md w-14" />)}
      </div>
      <div className="h-1.5 shimmer rounded-full w-full" />
      <div className="h-10 shimmer rounded-xl w-full" />
    </div>
  );
}

export default function GeneratePage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [hasGenerated, setHasGenerated] = useState(false);

  useEffect(() => { setSavedIds(new Set(getSavedIds())); }, []);

  async function handleGenerate(params: GenerateRequest) {
    setLoading(true);
    setIdeas([]);
    setHasGenerated(true);
    try {
      const res = await fetch("/api/ideas/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");
      setIdeas(data.ideas);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to generate ideas");
    } finally {
      setLoading(false);
    }
  }

  function handleSave(idea: Idea) {
    saveIdea(idea.id);
    setSavedIds((prev) => new Set(prev).add(idea.id));
    toast.success(`"${idea.title}" saved to Idea Bag`);
  }

  function handleUnsave(id: string) {
    unsaveIdea(id);
    setSavedIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
    toast.success("Removed from Idea Bag");
  }

  async function handleExpand(idea: Idea): Promise<Idea> {
    const res = await fetch(`/api/ideas/${idea.id}/expand`, { method: "POST" });
    if (!res.ok) throw new Error();
    const data = await res.json();
    setIdeas((prev) => prev.map((i) => (i.id === idea.id ? data.idea : i)));
    return data.idea;
  }

  return (
    <div className="space-y-8">
      <div className="animate-fade-in-up">
        <h1 className="text-2xl font-bold text-foreground">Generate Ideas</h1>
        <p className="text-muted-foreground mt-1">Pick your skill level and interests — we'll do the rest.</p>
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: "80ms" }}>
        <GenerateForm onGenerate={handleGenerate} loading={loading} />
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {ideas.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{ideas.length}</span> ideas generated
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ideas.map((idea, i) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                style={{ animationDelay: `${i * 80}ms` }}
                isSaved={savedIds.has(idea.id)}
                onSave={handleSave}
                onUnsave={handleUnsave}
                onExpand={handleExpand}
              />
            ))}
          </div>
        </>
      )}

      {!loading && !hasGenerated && (
        <div className="text-center py-24 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Your ideas will appear here</h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Configure your skill level and interests above, then click Generate Ideas.
          </p>
        </div>
      )}

      {!loading && hasGenerated && ideas.length === 0 && (
        <div className="text-center py-24 animate-fade-in">
          <p className="text-muted-foreground">No ideas returned. Try different settings or check your API key.</p>
        </div>
      )}
    </div>
  );
}
