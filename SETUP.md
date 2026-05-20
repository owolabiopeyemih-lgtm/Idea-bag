# ForgeFlow — Setup Guide

## Prerequisites
- Node.js 18+
- PostgreSQL database (local or hosted — Neon, Supabase, Railway)
- Clerk account (free tier)
- OpenAI API key

## 1. Install dependencies

```bash
npm install
```

## 2. Install shadcn/ui components

```bash
npx shadcn@latest init
npx shadcn@latest add button card badge select tabs dialog skeleton input textarea toast
```

## 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY` → from clerk.com dashboard
- `DATABASE_URL` → your PostgreSQL connection string
- `OPENAI_API_KEY` → from platform.openai.com

## 4. Set up the database

```bash
npm run db:generate   # generate Prisma client
npm run db:push       # push schema to database
```

## 5. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000

---

## Project Structure

```
app/
  page.tsx                   # Landing page
  (auth)/sign-in|sign-up     # Clerk auth pages
  (dashboard)/
    generate/page.tsx        # Idea generation UI
    saved/page.tsx           # Idea Bag
  api/
    ideas/generate/          # POST — generate ideas via OpenAI
    ideas/[id]/              # GET — single idea
    ideas/[id]/expand/       # POST — AI blueprint expansion
    saved/                   # GET+POST — saved ideas
    saved/[id]/              # DELETE+PATCH — manage saved idea

components/
  GenerateForm.tsx           # Skill level + category picker
  IdeaCard.tsx               # Individual idea card
  IdeaExpandDialog.tsx       # Full blueprint modal

lib/
  openai.ts                  # OpenAI prompts for generation + expansion
  prisma.ts                  # Prisma client singleton
  types.ts                   # Shared TypeScript types
  utils.ts                   # cn(), color helpers

prisma/
  schema.prisma              # User, Idea, SavedIdea, Collection models
```

## Deployment (Vercel)

```bash
vercel deploy
```

Add environment variables in Vercel dashboard under Settings → Environment Variables.
