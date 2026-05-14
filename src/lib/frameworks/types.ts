export type Thinker = "brene_brown" | "oprah" | "huberman" | "diary_of_ceo";

export type Category =
  | "courage"
  | "vulnerability"
  | "shame"
  | "trust"
  | "identity"
  | "mental_health"
  | "habits"
  | "neuroscience"
  | "community"
  | "spirituality"
  | "leadership"
  | "relationships"
  | "mindset"
  | "performance";

export interface Framework {
  id: string;
  thinker: Thinker;
  title: string;
  summary: string;
  fullDescription: string;
  category: Category;
  tags: string[];
  source: string;
  prompt: string;
}
