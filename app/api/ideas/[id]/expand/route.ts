import { NextResponse } from "next/server";
import { expandIdea } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { mapIdea } from "@/lib/idea-mapper";

const s = (arr: string[] | undefined | null, fallback: string) =>
  arr ? JSON.stringify(arr) : fallback;

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const raw = await prisma.idea.findUnique({ where: { id } });
    if (!raw) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const idea = mapIdea(raw);
    const expansion = await expandIdea(idea);

    const updated = await prisma.idea.update({
      where: { id },
      data: {
        mvpScope: expansion.mvpScope ?? raw.mvpScope,
        coreFeatures: s(expansion.coreFeatures, raw.coreFeatures),
        stretchGoals: s(expansion.stretchGoals, raw.stretchGoals),
        architecture: expansion.architecture ?? raw.architecture,
        suggestedApis: s(expansion.suggestedApis, raw.suggestedApis),
        dbRecommendation: expansion.dbRecommendation ?? raw.dbRecommendation,
        monetizationIdeas: s(expansion.monetizationIdeas, raw.monetizationIdeas),
        learningOutcomes: s(expansion.learningOutcomes, raw.learningOutcomes),
      },
    });

    return NextResponse.json({ idea: mapIdea(updated) });
  } catch (err) {
    console.error("[/api/ideas/:id/expand]", err);
    return NextResponse.json({ error: "Failed to expand idea" }, { status: 500 });
  }
}
