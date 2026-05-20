import Groq from "groq-sdk";
import OpenAI from "openai";
import type { Category, Idea, SkillLevel } from "./types";
import { getSampleIdeas } from "./sample-ideas";

function getClient(): { client: Groq | OpenAI; model: string } | null {
  if (process.env.GROQ_API_KEY) {
    return {
      client: new Groq({ apiKey: process.env.GROQ_API_KEY }),
      model: "llama-3.3-70b-versatile",
    };
  }
  if (process.env.OPENAI_API_KEY) {
    return {
      client: new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
      model: "gpt-4o-mini",
    };
  }
  return null;
}

export async function generateIdeas(
  skillLevel: SkillLevel,
  categories: Category[],
  count: number = 3,
  surpriseMe: boolean = false
): Promise<Omit<Idea, "id" | "createdAt">[]> {
  const ai = getClient();

  if (!ai) {
    return getSampleIdeas(skillLevel, categories, count, surpriseMe);
  }

  const skillDescriptions = {
    BEGINNER: "beginner developers learning fundamentals, building first portfolio projects (0-1 year experience)",
    INTERMEDIATE: "intermediate developers comfortable shipping small apps, seeking deeper technical challenges (1-3 years experience)",
    SENIOR: "senior engineers interested in architecture-heavy, systems-oriented, or startup-grade problems (3+ years experience)",
  };

  const categoryContext = surpriseMe
    ? "any interesting technical domain — be creative and unexpected"
    : `primarily: ${categories.join(", ")}`;

  const prompt = `You are a software project idea generator for developers. Generate ${count} unique, realistic, and actionable software project ideas.

Target audience: ${skillDescriptions[skillLevel]}
Categories: ${categoryContext}

Return a JSON object with an "ideas" array of exactly ${count} items. Each item:
{
  "title": "Short punchy project name",
  "description": "2-3 sentence overview",
  "problemSolved": "The real-world problem this solves",
  "skillLevel": "${skillLevel}",
  "categories": ["array", "of", "relevant", "categories"],
  "recommendedStack": ["Tech1", "Tech2"],
  "complexityScore": <integer 1-10>,
  "timeEstimate": "e.g. '2-3 weeks'",
  "learningOutcomes": ["Learning outcome 1", "Learning outcome 2"],
  "prerequisites": ["Required knowledge 1"],
  "teamSize": "Solo / 2-3 developers",
  "mvpScope": "What the MVP includes",
  "coreFeatures": ["Feature 1", "Feature 2"],
  "stretchGoals": ["Stretch goal 1"],
  "architecture": "Brief architecture description",
  "suggestedApis": ["API or service"],
  "dbRecommendation": "Recommended database and why",
  "monetizationIdeas": ["Monetization idea"]
}

Rules: avoid generic todo/weather apps, make ideas specific and novel, match complexity to skill level (BEGINNER: 1-4, INTERMEDIATE: 3-7, SENIOR: 6-10).`;

  try {
    const response = await (ai.client.chat.completions.create as Function)({
      model: ai.model,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.9,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("Empty response");

    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : (parsed.ideas ?? []);
  } catch (err: unknown) {
    const code = (err as { code?: string; status?: number })?.code;
    const status = (err as { status?: number })?.status;
    if (code === "insufficient_quota" || status === 429) {
      console.warn("API quota exceeded — falling back to sample ideas");
      return getSampleIdeas(skillLevel, categories, count, surpriseMe);
    }
    throw err;
  }
}

export async function expandIdea(idea: Idea): Promise<Partial<Idea>> {
  const ai = getClient();

  if (!ai) {
    return {
      mvpScope: idea.mvpScope ?? "Build an MVP focusing on the core features listed below.",
      coreFeatures: idea.coreFeatures.length ? idea.coreFeatures : ["Core feature 1", "Core feature 2"],
      stretchGoals: idea.stretchGoals.length ? idea.stretchGoals : ["Add user accounts", "Mobile support"],
      architecture: idea.architecture ?? "Client-server architecture with a REST API and a relational database.",
      suggestedApis: idea.suggestedApis,
      dbRecommendation: idea.dbRecommendation ?? "PostgreSQL for relational data; Redis for caching.",
      monetizationIdeas: idea.monetizationIdeas,
      learningOutcomes: idea.learningOutcomes,
    };
  }

  const prompt = `You are a software architect. Expand this project idea with detailed implementation guidance.

Project: ${idea.title}
Description: ${idea.description}
Skill Level: ${idea.skillLevel}
Stack: ${idea.recommendedStack.join(", ")}

Return a JSON object with:
{
  "mvpScope": "Detailed MVP scope",
  "coreFeatures": ["Detailed feature with implementation notes"],
  "stretchGoals": ["Stretch goal 1", "Stretch goal 2"],
  "architecture": "Detailed architecture with component breakdown and data flow",
  "suggestedApis": ["API name — what it does and why"],
  "dbRecommendation": "Specific database with schema hints",
  "monetizationIdeas": ["Specific strategy"],
  "learningOutcomes": ["Specific skill to learn"]
}`;

  const response = await (ai.client.chat.completions.create as Function)({
    model: ai.model,
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error("Empty response");
  return JSON.parse(content);
}
