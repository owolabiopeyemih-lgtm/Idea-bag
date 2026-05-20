import { NextResponse } from "next/server";
import { z } from "zod";
import { generateIdeas } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { mapIdea } from "@/lib/idea-mapper";

const schema = z.object({
  skillLevel: z.enum(["BEGINNER", "INTERMEDIATE", "SENIOR"]),
  categories: z.array(z.string()).default([]),
  count: z.number().int().min(1).max(5).default(3),
  surpriseMe: z.boolean().default(false),
});

const s = (arr: string[] | undefined) => JSON.stringify(arr ?? []);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { skillLevel, categories, count, surpriseMe } = schema.parse(body);

    const rawIdeas = await generateIdeas(skillLevel, categories as never, count, surpriseMe);

    const created = await prisma.$transaction(
      rawIdeas.map((idea) =>
        prisma.idea.create({
          data: {
            title: idea.title,
            description: idea.description,
            problemSolved: idea.problemSolved,
            skillLevel: idea.skillLevel,
            categories: s(idea.categories),
            recommendedStack: s(idea.recommendedStack),
            complexityScore: idea.complexityScore,
            timeEstimate: idea.timeEstimate,
            learningOutcomes: s(idea.learningOutcomes),
            prerequisites: s(idea.prerequisites),
            teamSize: idea.teamSize,
            mvpScope: idea.mvpScope,
            coreFeatures: s(idea.coreFeatures),
            stretchGoals: s(idea.stretchGoals),
            architecture: idea.architecture,
            suggestedApis: s(idea.suggestedApis),
            dbRecommendation: idea.dbRecommendation,
            monetizationIdeas: s(idea.monetizationIdeas),
          },
        })
      )
    );

    return NextResponse.json({ ideas: created.map(mapIdea) });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    console.error("[/api/ideas/generate]", err);
    return NextResponse.json({ error: "Failed to generate ideas" }, { status: 500 });
  }
}
