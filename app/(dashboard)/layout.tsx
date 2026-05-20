"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Hammer, Zap, Bookmark, Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/generate", icon: Zap,      label: "Generate" },
  { href: "/saved",    icon: Bookmark, label: "Idea Bag" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <nav className="glass fixed top-0 inset-x-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg shrink-0">
              <div className="w-7 h-7 rounded-lg bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-md shadow-primary/30">
                <Hammer className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="gradient-text">ForgeFlow</span>
            </Link>

            <div className="hidden sm:flex items-center gap-1">
              {navLinks.map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg font-medium transition-all",
                    pathname === href
                      ? "bg-primary/15 text-primary border border-primary/20 shadow-sm"
                      : "text-muted-foreground hover:text-foreground btn-glass-secondary"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="sm:hidden btn-glass-icon w-9 h-9 flex items-center justify-center rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-4 h-4 text-foreground" /> : <Menu className="w-4 h-4 text-foreground" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="sm:hidden border-t border-white/20 dark:border-white/10 bg-white/70 dark:bg-black/40 backdrop-blur-xl px-4 py-3 flex flex-col gap-1">
            {navLinks.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  pathname === href
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground btn-glass-secondary"
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-12">{children}</main>
    </div>
  );
}
