---
name: project-forgeflow
description: ForgeFlow — AI-powered software project idea generator for developers (skill-matched, structured blueprints)
metadata:
  type: project
---

ForgeFlow is a Next.js 15 full-stack web app being built in C:\Users\User\Downloads\ForgeFlow.

**Why:** Developer project idea generator — helps devs find skill-matched project ideas with full blueprints (MVP scope, stack, architecture, etc.)

**Stack chosen:** Next.js App Router + TypeScript + Tailwind + shadcn/ui, Clerk auth, Prisma + PostgreSQL, OpenAI API (gpt-4o-mini), Sonner toasts, PostHog analytics.

**How to apply:** When working on this project, follow Next.js 15 App Router conventions with `params` as `Promise<...>`. Clerk v6 auth pattern: `const { userId } = await auth()`. All API routes use Zod validation.

Key files:
- `lib/openai.ts` — prompts for idea generation and expansion
- `lib/types.ts` — SkillLevel, Category, Idea, GenerateRequest types
- `prisma/schema.prisma` — User, Idea, SavedIdea, Collection models
- `app/(dashboard)/generate/page.tsx` — main generate UI
- `components/IdeaCard.tsx` — idea card with save/expand
- `components/IdeaExpandDialog.tsx` — full blueprint modal

**How to apply:** Scaffolded but needs `npm install`, shadcn components installed via CLI, `.env.local` filled in, and `npm run db:push` before it runs.
