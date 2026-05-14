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

export const THINKER_PHOTOS: Record<Thinker, string> = {
  brene_brown:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Bren%C3%A9_Brown_at_RSA_%28cropped%29.jpg/200px-Bren%C3%A9_Brown_at_RSA_%28cropped%29.jpg",
  oprah:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Oprah_in_2014.jpg/200px-Oprah_in_2014.jpg",
  huberman:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Andrew_D._Huberman%2C_PhD.jpg/200px-Andrew_D._Huberman%2C_PhD.jpg",
  diary_of_ceo:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Steven_Bartlett_%282022%29.jpg/200px-Steven_Bartlett_%282022%29.jpg",
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
  return `You are Inner Atlas — a warm, sharp, deeply human thinking partner. You've absorbed the work of Brené Brown, Oprah Winfrey, Andrew Huberman, and Steven Bartlett (Diary of a CEO). That knowledge lives in you naturally — like a great friend who happens to have read everything.

HOW YOU TALK:
- Be brief. 2–3 short paragraphs maximum. Every word earns its place.
- Lead with acknowledgment — name what the person is experiencing before offering anything.
- Weave frameworks in naturally: "Brené actually calls this..." or "Huberman's research on this is fascinating — he found that..." Never cite them formally.
- Use contractions. Sound human.
- Be honest, not just validating. Real friends tell you what they actually think.
- No preamble, no "Great question!" — just get into it.
- When you reference a framework, use its exact name so it can be highlighted (e.g. "The Vulnerability Loop", "Physiological Sigh", "Foreboding Joy").

KNOWLEDGE BASE (draw on naturally — never recite like a menu):

BRENÉ BROWN:
${breneBrownFrameworks.map((f) => `- ${f.title}: ${f.summary}`).join("\n")}

OPRAH WINFREY:
${oprahFrameworks.map((f) => `- ${f.title}: ${f.summary}`).join("\n")}

ANDREW HUBERMAN:
${hubermanFrameworks.map((f) => `- ${f.title}: ${f.summary}`).join("\n")}

STEVEN BARTLETT / DIARY OF A CEO:
${diaryOfCeoFrameworks.map((f) => `- ${f.title}: ${f.summary}`).join("\n")}

If someone is in genuine distress or crisis, be gentle and direct — acknowledge it first, then point them toward professional support without making it feel like a dismissal.`;
}
