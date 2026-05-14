import { breneBrownFrameworks } from "./brene-brown";
import { oprahFrameworks } from "./oprah";
import { hubermanFrameworks } from "./huberman";
import { diaryOfCeoFrameworks } from "./diary-of-ceo";
import type { Framework, Thinker, Category } from "./types";

export type { Framework, Thinker, Category };

export const ALL_FRAMEWORKS: Framework[] = [
  ...breneBrownFrameworks,
  ...oprahFrameworks,
  ...hubermanFrameworks,
  ...diaryOfCeoFrameworks,
];

export const THINKER_LABELS: Record<Thinker, string> = {
  brene_brown: "Brené Brown",
  oprah: "Oprah Winfrey",
  huberman: "Andrew Huberman",
  diary_of_ceo: "Diary of a CEO",
};

export const THINKER_COLORS: Record<Thinker, { bg: string; text: string; border: string }> = {
  brene_brown: { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-300" },
  oprah: { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-300" },
  huberman: { bg: "bg-sky-100", text: "text-sky-800", border: "border-sky-300" },
  diary_of_ceo: { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-300" },
};

export const CATEGORY_LABELS: Record<Category, string> = {
  courage: "Courage",
  vulnerability: "Vulnerability",
  shame: "Shame & Healing",
  trust: "Trust",
  identity: "Identity",
  mental_health: "Mental Health",
  habits: "Habits & Biology",
  neuroscience: "Neuroscience",
  community: "Community",
  spirituality: "Spirituality",
  leadership: "Leadership",
  relationships: "Relationships",
  mindset: "Mindset",
  performance: "Performance",
};

export function searchFrameworks(query: string): Framework[] {
  const q = query.toLowerCase().trim();
  if (!q) return ALL_FRAMEWORKS;
  return ALL_FRAMEWORKS.filter(
    (f) =>
      f.title.toLowerCase().includes(q) ||
      f.summary.toLowerCase().includes(q) ||
      f.tags.some((t) => t.toLowerCase().includes(q)) ||
      THINKER_LABELS[f.thinker].toLowerCase().includes(q)
  );
}

export function filterByThinker(thinker: Thinker): Framework[] {
  return ALL_FRAMEWORKS.filter((f) => f.thinker === thinker);
}

export function filterByCategory(category: Category): Framework[] {
  return ALL_FRAMEWORKS.filter((f) => f.category === category);
}

export function getFrameworkById(id: string): Framework | undefined {
  return ALL_FRAMEWORKS.find((f) => f.id === id);
}

export function getDailyFramework(date?: Date): Framework {
  const d = date ?? new Date();
  const dayOfYear = Math.floor(
    (d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return ALL_FRAMEWORKS[dayOfYear % ALL_FRAMEWORKS.length];
}

export function getFrameworkSystemPrompt(): string {
  return `You are an empathetic, grounded life coach called Inner Atlas, trained in the frameworks of four transformational thinkers. Your responses always cite which framework(s) you are drawing from and briefly explain how it applies.

The four thinkers and their core frameworks:

=== BRENÉ BROWN ===
${breneBrownFrameworks.map((f) => `- ${f.title}: ${f.summary}`).join("\n")}

=== OPRAH WINFREY ===
${oprahFrameworks.map((f) => `- ${f.title}: ${f.summary}`).join("\n")}

=== ANDREW HUBERMAN ===
${hubermanFrameworks.map((f) => `- ${f.title}: ${f.summary}`).join("\n")}

=== DIARY OF A CEO (STEVEN BARTLETT) ===
${diaryOfCeoFrameworks.map((f) => `- ${f.title}: ${f.summary}`).join("\n")}

Guidelines:
- Be warm, direct, and honest — not performatively positive
- Ground every response in at least one specific framework, naming it
- Ask one good follow-up question at the end of each response
- When appropriate, offer a concrete reflection prompt or micro-action
- Never be preachy — you are a thinking partner, not a lecturer
- If the person is in genuine crisis, gently point them toward professional support`;
}
