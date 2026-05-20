"use client";

import { useState } from "react";
import { Zap, Shuffle } from "lucide-react";
import { CATEGORIES, SKILL_LEVELS, type Category, type GenerateRequest, type SkillLevel } from "@/lib/types";
import { haptics } from "@/lib/haptics";
import { cn } from "@/lib/utils";

interface Props {
  onGenerate: (params: GenerateRequest) => void;
  loading: boolean;
}

export function GenerateForm({ onGenerate, loading }: Props) {
  const [skillLevel, setSkillLevel] = useState<SkillLevel>("INTERMEDIATE");
  const [categories, setCategories] = useState<Category[]>([]);
  const [count, setCount] = useState(3);
  const [chipAnimating, setChipAnimating] = useState<string | null>(null);

  function toggleCategory(cat: Category) {
    setChipAnimating(cat);
    setTimeout(() => setChipAnimating(null), 220);
    setCategories((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);
    haptics.generate();
  }

  function handleSkillLevel(level: SkillLevel) {
    setSkillLevel(level);
    haptics.generate();
  }

  return (
    <div className="glass-panel rounded-2xl p-6 space-y-6">
      {/* Skill Level */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-3">Skill Level</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SKILL_LEVELS.map(({ value, label, description }) => {
            const active = skillLevel === value;
            return (
              <button
                key={value}
                onClick={() => handleSkillLevel(value)}
                className={cn(
                  "p-4 border-2 rounded-xl text-left outline-none",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  active
                    ? "border-primary/50 bg-primary/5 dark:bg-primary/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]"
                    : "border-white/30 dark:border-white/10 hover:border-primary/30 bg-white/40 dark:bg-white/[0.04] hover:bg-white/60 dark:hover:bg-white/[0.07]"
                )}
                style={{
                  transition: `border-color var(--duration-fast) var(--ease-out-quart), background var(--duration-fast) var(--ease-out-quart), transform var(--duration-fast) var(--ease-spring)`,
                }}
              >
                <p className={cn("font-semibold text-sm", active ? "text-primary" : "text-foreground")}>
                  {label}
                </p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1">Interest Areas</label>
        <p className="text-xs text-muted-foreground mb-3">Leave empty for any domain</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const active = categories.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-full border font-medium outline-none",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                  chipAnimating === cat && "animate-chip-select",
                  active
                    ? "bg-primary text-primary-foreground border-primary/60 shadow-sm"
                    : "bg-white/50 dark:bg-white/5 text-muted-foreground border-white/40 dark:border-white/10 hover:border-primary/40 hover:text-foreground"
                )}
                style={{
                  transition: `background var(--duration-fast) var(--ease-out-quart), color var(--duration-fast) var(--ease-out-quart), border-color var(--duration-fast) var(--ease-out-quart), box-shadow var(--duration-fast) var(--ease-out-quart)`,
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Count slider */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-3">
          Number of ideas: <span className="text-primary tabular-nums">{count}</span>
        </label>
        <input
          type="range" min={1} max={5} value={count}
          onChange={(e) => { setCount(Number(e.target.value)); haptics.generate(); }}
          className="w-full accent-primary h-1.5 rounded-full cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-2 px-0.5">
          {[1,2,3,4,5].map((n) => (
            <span key={n} className={cn("tabular-nums transition-colors", n === count ? "text-primary font-semibold" : "")}>{n}</span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        <button
          onClick={() => { onGenerate({ skillLevel, categories, count, surpriseMe: false }); haptics.success(); }}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 btn-glass-primary py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {loading
            ? <><Loader className="w-4 h-4 animate-spin-slow" />Generating…</>
            : <><Zap className="w-4 h-4" />Generate Ideas</>
          }
        </button>
        <button
          onClick={() => { onGenerate({ skillLevel, categories: [], count: 1, surpriseMe: true }); haptics.success(); }}
          disabled={loading}
          className="sm:w-auto flex items-center justify-center gap-2 btn-glass-secondary text-foreground px-5 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Shuffle className="w-4 h-4" />
          Surprise Me
        </button>
      </div>
    </div>
  );
}

function Loader({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
