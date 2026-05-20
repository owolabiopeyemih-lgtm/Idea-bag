import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapIdea } from "@/lib/idea-mapper";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idea = await prisma.idea.findUnique({ where: { id } });
    if (!idea) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ idea: mapIdea(idea) });
  } catch (err) {
    console.error("[/api/ideas/:id GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
