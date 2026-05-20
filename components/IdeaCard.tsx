"use client";

import { useState, useRef } from "react";
import {
  Bookmark, BookmarkCheck, ChevronDown, ChevronUp,
  Loader2, Clock, Users, Zap, MoreHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import { cn, skillLevelColor, complexityColor, complexityLabel } from "@/lib/utils";
import { haptics } from "@/lib/haptics";
import type { Idea } from "@/lib/types";
import type { IdeaStatus } from "@/lib/saved-ideas";
import { IdeaExpandDialog } from "./IdeaExpandDialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  idea: Idea;
  isSaved: boolean;
  status?: IdeaStatus;
  style?: React.CSSProperties;
  onSave?: (idea: Idea) => void;
  onUnsave?: (id: string) => void;
  onStatusChange?: (id: string, status: IdeaStatus) => void;
  onExpand: (idea: Idea) => Promise<Idea>;
}

const STATUS_OPTIONS: { value: IdeaStatus; label: string; color: string }[] = [
  { value: "SAVED",       label: "Saved",       color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
  { value: "IN_PROGRESS", label: "In Progress",  color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  { value: "COMPLETED",   label: "Completed",    color: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" },
  { value: "ABANDONED",   label: "Abandoned",    color: "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400" },
];

export function IdeaCard({ idea, isSaved, status, style, onSave, onUnsave, onStatusChange, onExpand }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [expandedIdea, setExpandedIdea] = useState<Idea>(idea);
  const [expanding, setExpanding] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saveAnimating, setSaveAnimating] = useState(false);

  const currentStatus = STATUS_OPTIONS.find((s) => s.value === (status ?? "SAVED"));

  function handleSaveToggle() {
    if (isSaved) {
      onUnsave?.(idea.id);
      haptics.dismiss();
    } else {
      setSaveAnimating(true);
      setTimeout(() => setSaveAnimating(false), 450);
      onSave?.(idea);
      haptics.save();
    }
  }

  async function handleExpand() {
    if (expandedIdea.mvpScope && expandedIdea.coreFeatures.length > 2) {
      setDialogOpen(true);
      haptics.generate();
      return;
    }
    setExpanding(true);
    try {
      const result = await onExpand(expandedIdea);
      setExpandedIdea(result);
      setDialogOpen(true);
      haptics.success();
      toast.success("Blueprint expanded");
    } catch {
      haptics.error();
      toast.error("Failed to expand idea");
    } finally {
      setExpanding(false);
    }
  }

  return (
    <>
      <div style={style} className="group relative glass-card rounded-2xl p-5 flex flex-col gap-4 card-hover animate-fade-in-up">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-card-foreground leading-snug line-clamp-2">{idea.title}</h3>
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full border", skillLevelColor(idea.skillLevel))}>
                {idea.skillLevel.charAt(0) + idea.skillLevel.slice(1).toLowerCase()}
              </span>
              {isSaved && currentStatus && (
                <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full transition-colors duration-200", currentStatus.color)}>
                  {currentStatus.label}
                </span>
              )}
              {idea.categories.slice(0, 1).map((cat) => (
                <span key={cat} className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{cat}</span>
              ))}
              {idea.categories.length > 1 && (
                <span className="text-xs text-muted-foreground">+{idea.categories.length - 1}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-0.5 shrink-0">
            {isSaved && onStatusChange && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="btn-press w-7 h-7 flex items-center justify-center rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors duration-[140ms]">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuLabel className="text-xs text-muted-foreground">Update status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {STATUS_OPTIONS.map((opt) => (
                    <DropdownMenuItem
                      key={opt.value}
                      onClick={() => { onStatusChange(idea.id, opt.value); haptics.generate(); }}
                      className={cn("text-xs cursor-pointer gap-2", status === opt.value && "font-semibold")}
                    >
                      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", opt.color.includes("blue") ? "bg-blue-500" : opt.color.includes("green") ? "bg-green-500" : opt.color.includes("red") ? "bg-red-500" : "bg-slate-400")} />
                      {opt.label}
                      {status === opt.value && <span className="ml-auto text-primary">✓</span>}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => { onUnsave?.(idea.id); haptics.dismiss(); }}
                    className="text-xs text-destructive cursor-pointer focus:text-destructive"
                  >
                    Remove from Idea Bag
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <button
              onClick={handleSaveToggle}
              className={cn(
                "btn-press w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-[140ms]",
                isSaved ? "text-primary hover:bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
              title={isSaved ? "Remove from Idea Bag" : "Save to Idea Bag"}
            >
              <span className={saveAnimating ? "animate-save-pop" : ""}>
                {isSaved
                  ? <BookmarkCheck className="w-4 h-4" />
                  : <Bookmark className="w-4 h-4" />}
              </span>
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{idea.description}</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { Icon: Zap, label: complexityLabel(idea.complexityScore), className: complexityColor(idea.complexityScore) },
            { Icon: Clock, label: idea.timeEstimate, className: "text-muted-foreground" },
            { Icon: Users, label: idea.teamSize, className: "text-muted-foreground" },
          ].map(({ Icon, label, className }) => (
            <div key={label} className="flex items-center gap-1.5 text-xs overflow-hidden">
              <Icon className={cn("w-3.5 h-3.5 shrink-0", className)} />
              <span className="text-muted-foreground truncate">{label}</span>
            </div>
          ))}
        </div>

        {/* Stack */}
        <div className="flex flex-wrap gap-1.5">
          {idea.recommendedStack.slice(0, 4).map((tech) => (
            <span key={tech} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md font-medium">
              {tech}
            </span>
          ))}
          {idea.recommendedStack.length > 4 && (
            <span className="text-xs text-muted-foreground self-center">+{idea.recommendedStack.length - 4}</span>
          )}
        </div>

        {/* Learning outcomes toggle */}
        {idea.learningOutcomes.length > 0 && (
          <div>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="btn-press flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors duration-[140ms]"
            >
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {expanded ? "Hide" : "Show"} learning outcomes
            </button>
            {expanded && (
              <ul className="mt-2.5 space-y-1.5 animate-fade-in">
                {idea.learningOutcomes.map((o) => (
                  <li key={o} className="text-xs text-muted-foreground flex gap-2">
                    <span className="text-primary mt-0.5 shrink-0">•</span>
                    {o}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Complexity bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Complexity</span>
            <span className={cn("font-medium", complexityColor(idea.complexityScore))}>{idea.complexityScore}/10</span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full animate-bar-fill",
                idea.complexityScore <= 3 ? "bg-green-500" :
                idea.complexityScore <= 6 ? "bg-yellow-500" : "bg-red-500"
              )}
              style={{ width: `${idea.complexityScore * 10}%` }}
            />
          </div>
        </div>

        {/* Blueprint button */}
        <button
          onClick={handleExpand}
          disabled={expanding}
          className="btn-glass-secondary w-full text-sm font-medium text-primary rounded-xl py-2.5 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {expanding
            ? <><Loader2 className="w-3.5 h-3.5 animate-spin-slow" /> Expanding…</>
            : "View Full Blueprint"
          }
        </button>
      </div>

      <IdeaExpandDialog idea={expandedIdea} open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  );
}
