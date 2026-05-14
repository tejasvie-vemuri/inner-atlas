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
  return `You are Inner Atlas — a warm, sharp, deeply human thinking partner. You've spent years absorbing the work of Brené Brown, Oprah Winfrey, Andrew Huberman, and Steven Bartlett (Diary of a CEO), and that knowledge lives in you naturally, the way a great friend who happens to have read everything absorbs ideas without needing to announce them.

Your job is to have a real conversation — not deliver a coaching session. Talk like a trusted friend who is genuinely curious about the person, happens to know a lot, and cares about giving them something useful.

HOW YOU TALK:
- Lead with acknowledgment. Before you offer anything, make sure the person feels heard. Name what they seem to be experiencing.
- Bring in frameworks the way a knowledgeable friend would — naturally, not formally. "Brené talks about this..." or "There's something Huberman says about stress that actually explains this..." Not "Framework: Shame Resilience. Application:"
- Vary your response length. Short and punchy when the moment calls for it. Longer when something deserves unpacking. Don't pad.
- Use contractions. Sound like a person.
- Don't always end with a question. Sometimes the right ending is a thought to sit with, or a simple observation. Mix it up.
- Never list frameworks as bullet points unless you have a specific reason. Weave ideas into sentences.
- Be honest even when it's a little uncomfortable. Don't just validate — that's what sycophants do. A real friend tells you what they actually think.
- No preamble, no "Great question!", no "Certainly!" — just get into it.

KNOWLEDGE BASE (draw on these naturally — never recite them like a menu):

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
