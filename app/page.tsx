import Link from "next/link";
import { Hammer, Zap, BookOpen, Bookmark, Shuffle, BarChart3, ArrowRight, Check } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="w-8 h-8 rounded-lg bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-primary/30">
              <Hammer className="w-4 h-4 text-white" />
            </div>
            <span className="gradient-text">ForgeFlow</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/generate"
              className="hidden sm:flex items-center gap-1.5 btn-glass-primary text-sm px-4 py-2 rounded-lg font-medium"
            >
              Get started <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 max-w-6xl mx-auto text-center">
        <div className="animate-fade-in-up">
          <span className="inline-flex items-center gap-2 glass-badge text-accent-foreground text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            AI-Powered for Developers
          </span>
        </div>
        <h1 className="animate-fade-in-up animation-delay-100 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6 tracking-tight">
          Stop wondering what to build.
          <br />
          <span className="gradient-text">Start forging.</span>
        </h1>
        <p className="animate-fade-in-up animation-delay-200 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          ForgeFlow generates structured, skill-matched software project ideas with full blueprints — tailored to your experience level and what you want to learn.
        </p>
        <div className="animate-fade-in-up animation-delay-300 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/generate"
            className="w-full sm:w-auto flex items-center justify-center gap-2 btn-glass-primary px-6 py-3 rounded-xl font-semibold"
          >
            <Zap className="w-4 h-4" /> Generate my first idea
          </Link>
          <Link
            href="#how-it-works"
            className="w-full sm:w-auto flex items-center justify-center gap-2 btn-glass-secondary text-foreground px-6 py-3 rounded-xl font-semibold"
          >
            See how it works <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Stats */}
        <div className="animate-fade-in-up animation-delay-400 mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {[
            { value: "3", label: "Skill Levels" },
            { value: "11", label: "Tech Domains" },
            { value: "5×", label: "Ideas per Run" },
          ].map(({ value, label }) => (
            <div key={label} className="glass-card rounded-xl p-4 text-center">
              <p className="text-2xl font-extrabold gradient-text">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 bg-white/30 dark:bg-white/[0.03] border-y border-white/30 dark:border-white/10 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-12">
            From blank page to clear blueprint in seconds
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Pick your level", desc: "Choose Beginner, Intermediate, or Senior and select the tech domains you care about." },
              { step: "02", title: "Generate ideas", desc: "AI produces structured project ideas matched to your skill level — no todo apps, no weather widgets." },
              { step: "03", title: "Get the blueprint", desc: "Expand any idea into a full plan: MVP scope, architecture, APIs, stack, and monetization ideas." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="relative glass-card rounded-2xl p-6 card-hover">
                <span className="text-4xl font-black gradient-text opacity-30 absolute top-4 right-5">{step}</span>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Check className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-4">
          Everything you need to go from idea to execution
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
          Not just an idea generator — a complete planning tool that gives you clarity before you write a single line of code.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: Zap,       title: "Skill-Matched Ideas",    desc: "Every idea is calibrated to your experience — from \"build a CLI tool\" to \"architect a distributed system\"." },
            { icon: BookOpen,  title: "Full Project Blueprint", desc: "MVP scope, core features, architecture patterns, database picks, and stretch goals — all included." },
            { icon: BarChart3, title: "Complexity Scoring",     desc: "Know exactly what you're getting into: difficulty score, time estimates, and prerequisite knowledge." },
            { icon: Bookmark,  title: "Idea Bag",               desc: "Save your favourites, track status (Saved → In Progress → Completed), and revisit any time." },
            { icon: Zap,       title: "AI Expansion",           desc: "One click to go deeper: user flows, database schemas, API design, and monetization strategies." },
            { icon: Shuffle,   title: "Surprise Me Mode",       desc: "Feeling adventurous? Get a random idea outside your usual stack and stretch your skills." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="group glass-card rounded-2xl p-6 card-hover">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social proof */}
      <section className="py-16 px-4 sm:px-6 bg-white/30 dark:bg-white/[0.03] border-y border-white/30 dark:border-white/10 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xl sm:text-2xl font-semibold text-foreground italic leading-relaxed">
            "The hardest part of a side project isn't building it — it's deciding what to build. ForgeFlow removes that friction entirely."
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full glass-badge flex items-center justify-center text-primary font-bold text-sm">M</div>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">Maya O.</p>
              <p className="text-xs text-muted-foreground">Intermediate Developer · Lagos</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
            Ready to build something real?
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">No sign-up. No credit card. Just open and start generating.</p>
          <Link
            href="/generate"
            className="inline-flex items-center gap-2 btn-glass-primary px-8 py-4 rounded-xl font-semibold text-lg"
          >
            <Zap className="w-5 h-5" /> Generate ideas now
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/20 dark:border-white/10 py-8 px-6 bg-white/10 dark:bg-white/[0.02] backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <Hammer className="w-4 h-4 text-primary" />
            ForgeFlow
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} ForgeFlow. Built for developers.</p>
        </div>
      </footer>
    </div>
  );
}
