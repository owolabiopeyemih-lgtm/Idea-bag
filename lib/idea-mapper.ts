import type { Idea } from "./types";

type RawIdea = {
  id: string;
  title: string;
  description: string;
  problemSolved: string;
  skillLevel: string;
  categories: unknown;
  recommendedStack: unknown;
  complexityScore: number;
  timeEstimate: string;
  learningOutcomes: unknown;
  prerequisites: unknown;
  teamSize: string;
  mvpScope?: string | null;
  coreFeatures: unknown;
  stretchGoals: unknown;
  architecture?: string | null;
  suggestedApis: unknown;
  dbRecommendation?: string | null;
  monetizationIdeas: unknown;
  createdAt: Date;
};

function toStringArray(val: unknown): string[] {
  if (Array.isArray(val)) return val as string[];
  if (typeof val === "string") {
    try { return JSON.parse(val); } catch { return []; }
  }
  return [];
}

export function mapIdea(raw: RawIdea): Idea {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    problemSolved: raw.problemSolved,
    skillLevel: raw.skillLevel as Idea["skillLevel"],
    categories: toStringArray(raw.categories),
    recommendedStack: toStringArray(raw.recommendedStack),
    complexityScore: raw.complexityScore,
    timeEstimate: raw.timeEstimate,
    learningOutcomes: toStringArray(raw.learningOutcomes),
    prerequisites: toStringArray(raw.prerequisites),
    teamSize: raw.teamSize,
    mvpScope: raw.mvpScope,
    coreFeatures: toStringArray(raw.coreFeatures),
    stretchGoals: toStringArray(raw.stretchGoals),
    architecture: raw.architecture,
    suggestedApis: toStringArray(raw.suggestedApis),
    dbRecommendation: raw.dbRecommendation,
    monetizationIdeas: toStringArray(raw.monetizationIdeas),
    createdAt: raw.createdAt,
  };
}
