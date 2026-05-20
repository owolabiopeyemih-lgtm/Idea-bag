import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { SkillLevel } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function skillLevelColor(level: SkillLevel): string {
  return {
    BEGINNER:     "bg-green-100  text-gray-900 border-green-300",
    INTERMEDIATE: "bg-blue-100   text-gray-900 border-blue-300",
    SENIOR:       "bg-purple-100 text-gray-900 border-purple-300",
  }[level];
}

export function complexityColor(score: number): string {
  if (score <= 3) return "text-green-600";
  if (score <= 6) return "text-yellow-600";
  return "text-red-600";
}

export function complexityLabel(score: number): string {
  if (score <= 2) return "Easy";
  if (score <= 4) return "Moderate";
  if (score <= 6) return "Challenging";
  if (score <= 8) return "Advanced";
  return "Expert";
}
