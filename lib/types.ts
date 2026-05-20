export type SkillLevel = "BEGINNER" | "INTERMEDIATE" | "SENIOR";

export type ProjectStatus = "SAVED" | "IN_PROGRESS" | "COMPLETED" | "ABANDONED";

export type Category =
  | "Frontend"
  | "Backend"
  | "Fullstack"
  | "AI/ML"
  | "DevTools"
  | "SaaS"
  | "Mobile"
  | "Systems"
  | "Open Source"
  | "Automation"
  | "APIs";

export interface Idea {
  id: string;
  title: string;
  description: string;
  problemSolved: string;
  skillLevel: SkillLevel;
  categories: string[];
  recommendedStack: string[];
  complexityScore: number;
  timeEstimate: string;
  learningOutcomes: string[];
  prerequisites: string[];
  teamSize: string;
  mvpScope?: string | null;
  coreFeatures: string[];
  stretchGoals: string[];
  architecture?: string | null;
  suggestedApis: string[];
  dbRecommendation?: string | null;
  monetizationIdeas: string[];
  createdAt: string | Date;
}

export interface SavedIdea {
  id: string;
  userId: string;
  ideaId: string;
  idea: Idea;
  notes?: string | null;
  status: ProjectStatus;
  createdAt: string | Date;
}

export interface GenerateRequest {
  skillLevel: SkillLevel;
  categories: Category[];
  count?: number;
  surpriseMe?: boolean;
}

export interface GenerateResponse {
  ideas: Idea[];
}

export const CATEGORIES: Category[] = [
  "Frontend",
  "Backend",
  "Fullstack",
  "AI/ML",
  "DevTools",
  "SaaS",
  "Mobile",
  "Systems",
  "Open Source",
  "Automation",
  "APIs",
];

export const SKILL_LEVELS: { value: SkillLevel; label: string; description: string }[] = [
  {
    value: "BEGINNER",
    label: "Beginner",
    description: "Learning the fundamentals, building a first portfolio",
  },
  {
    value: "INTERMEDIATE",
    label: "Intermediate",
    description: "Comfortable shipping apps, seeking deeper challenges",
  },
  {
    value: "SENIOR",
    label: "Senior",
    description: "Architecture-heavy or systems-level complexity",
  },
];

export const COMPLEXITY_LABELS: Record<number, string> = {
  1: "Trivial",
  2: "Easy",
  3: "Moderate",
  4: "Challenging",
  5: "Complex",
  6: "Advanced",
  7: "Expert",
  8: "Hardcore",
  9: "Extreme",
  10: "Legendary",
};
