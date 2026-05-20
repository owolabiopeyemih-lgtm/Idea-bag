# ForgeFlow

> **AI-powered software project idea generator for developers** — structured, skill-matched ideas with full blueprints, ready to build.

![ForgeFlow](https://img.shields.io/badge/Built%20with-Next.js%2015-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## What is ForgeFlow?

Developers often know they want to build something, but don't know *what*. ForgeFlow solves decision paralysis by generating structured, actionable project ideas tailored to your:

- **Skill level** — Beginner, Intermediate, or Senior
- **Interest areas** — Frontend, Backend, AI/ML, DevTools, SaaS, Mobile, and more
- **Learning goals** — every idea includes what you'll actually learn by building it

Each generated idea comes with a full **project blueprint** — not just a one-liner, but a complete plan covering MVP scope, architecture, recommended stack, database choice, APIs to use, stretch goals, and monetization ideas.

---

## Features

| Feature | Description |
|---|---|
| **Skill-Matched Generation** | Ideas calibrated to Beginner, Intermediate, or Senior level |
| **Full Project Blueprint** | MVP scope, architecture, stack, DB, APIs, stretch goals |
| **Complexity Scoring** | 1–10 difficulty score with time estimates and prerequisites |
| **11 Interest Categories** | Frontend, Backend, Fullstack, AI/ML, DevTools, SaaS, Mobile, Systems, Open Source, Automation, APIs |
| **Idea Bag** | Save ideas to your browser, track status (Saved → In Progress → Completed) |
| **AI Expansion** | One-click deep-dive into any idea for more detail |
| **Surprise Me Mode** | Random idea outside your usual domains |
| **Copy Blueprint** | Copy the full structured plan to clipboard as Markdown |
| **Dark Mode** | Full dark/light theme with system preference detection |
| **No Sign-up Required** | Open and use immediately — no account needed |

---

## Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** — App Router, Server Components
- **[TypeScript](https://www.typescriptlang.org/)** — full type safety
- **[Tailwind CSS](https://tailwindcss.com/)** — utility-first styling
- **[shadcn/ui](https://ui.shadcn.com/)** — accessible component primitives
- **[next-themes](https://github.com/pacocoursey/next-themes)** — dark/light mode
- **[Sonner](https://sonner.emilkowal.ski/)** — toast notifications
- **[Motion](https://motion.dev/)** — animations
- **[web-haptics](https://github.com/nicholasgasior/web-haptics)** — mobile haptic feedback

### Backend
- **Next.js API Routes** — serverless API endpoints
- **[Prisma ORM](https://www.prisma.io/)** — type-safe database access
- **SQLite** (local dev) / **PostgreSQL** (production)

### AI
- **[Groq](https://groq.com/)** — free tier LLM inference (Llama 3.3 70B) — *recommended*
- **[OpenAI](https://openai.com/)** — GPT-4o Mini fallback
- **Sample ideas** — built-in fallback when no API key is configured

---

## Getting Started

### Prerequisites

- Node.js 18+
- A free [Groq API key](https://console.groq.com) *(recommended — no credit card)*
- Or an [OpenAI API key](https://platform.openai.com) *(paid)*

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/owolabiopeyemih-lgtm/Idea-bag.git
cd Idea-bag

# 2. Install dependencies
npm install

# 3. Install shadcn/ui components
npx shadcn@latest init -d -f --base radix
npx shadcn@latest add button card badge select tabs dialog skeleton input textarea separator tooltip dropdown-menu label sheet scroll-area -o

# 4. Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Edit `.env.local` with your values:

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# AI Provider — use either (Groq is free)
GROQ_API_KEY=gsk_...          # console.groq.com — free, no credit card
OPENAI_API_KEY=sk-...         # platform.openai.com — paid

# Analytics (optional)
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### Database Setup

```bash
npm run db:generate   # generate Prisma client
npm run db:push       # create database tables
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
forgeflow/
├── app/
│   ├── page.tsx                        # Landing page
│   ├── layout.tsx                      # Root layout (ThemeProvider, Toaster)
│   ├── globals.css                     # Global styles + design tokens
│   ├── (dashboard)/
│   │   ├── layout.tsx                  # Dashboard nav (mobile + dark mode)
│   │   ├── generate/page.tsx           # Idea generation UI
│   │   └── saved/page.tsx              # Idea Bag (filter, sort, status)
│   └── api/
│       ├── ideas/generate/route.ts     # POST — generate ideas via AI
│       ├── ideas/[id]/route.ts         # GET — fetch single idea
│       └── ideas/[id]/expand/route.ts  # POST — AI blueprint expansion
│
├── components/
│   ├── GenerateForm.tsx                # Skill level + category picker
│   ├── IdeaCard.tsx                    # Idea card with save/expand/status
│   ├── IdeaExpandDialog.tsx            # Full blueprint modal with copy
│   ├── ThemeToggle.tsx                 # Dark/light mode toggle
│   └── ui/                            # shadcn/ui components
│
├── lib/
│   ├── openai.ts                       # Groq/OpenAI client + prompts
│   ├── prisma.ts                       # Prisma singleton
│   ├── types.ts                        # Shared TypeScript types
│   ├── utils.ts                        # cn(), color helpers
│   ├── idea-mapper.ts                  # DB row → typed Idea object
│   ├── saved-ideas.ts                  # localStorage Idea Bag helpers
│   ├── haptics.ts                      # web-haptics wrapper
│   └── sample-ideas.ts                 # Built-in fallback ideas
│
└── prisma/
    └── schema.prisma                   # Idea model (SQLite/PostgreSQL)
```

---

## API Reference

### Generate Ideas
```http
POST /api/ideas/generate
Content-Type: application/json

{
  "skillLevel": "BEGINNER" | "INTERMEDIATE" | "SENIOR",
  "categories": ["Frontend", "AI/ML", ...],
  "count": 1-5,
  "surpriseMe": false
}
```

### Get Idea
```http
GET /api/ideas/:id
```

### Expand Idea (AI Blueprint)
```http
POST /api/ideas/:id/expand
```

---

## AI Fallback Behaviour

ForgeFlow works at three levels:

```
GROQ_API_KEY set?  →  Use Groq (Llama 3.3 70B) — free, fast
      ↓ no
OPENAI_API_KEY set? →  Use GPT-4o Mini
      ↓ no / quota exceeded
Built-in sample ideas (always available, no key needed)
```

---

## Deployment

### Vercel (recommended)

```bash
npm install -g vercel
vercel deploy --prod
```

Add environment variables in the Vercel dashboard under **Settings → Environment Variables**.

For production, switch to a hosted PostgreSQL database:
- **[Neon](https://neon.tech)** — serverless Postgres, generous free tier
- **[Supabase](https://supabase.com)** — full Postgres with free tier
- **[Railway](https://railway.app)** — simple provisioning

Update `prisma/schema.prisma` to use `provider = "postgresql"` and set your `DATABASE_URL`.

---

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations (production)
npm run db:studio    # Open Prisma Studio (DB GUI)
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## Roadmap

- [ ] GitHub repository auto-creation from blueprint
- [ ] Personalized recommendation engine
- [ ] Community-submitted ideas
- [ ] Learning path generation
- [ ] Hackathon mode
- [ ] Startup validation scoring
- [ ] Team project matching
- [ ] Weekly curated idea drops

---

## License

MIT © [Owolabi Opeyemi](https://github.com/owolabiopeyemih-lgtm)

---

<div align="center">
  <strong>Built for developers who are ready to stop planning and start building.</strong>
</div>
