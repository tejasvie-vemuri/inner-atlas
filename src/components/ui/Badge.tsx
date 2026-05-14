import { clsx } from "clsx";

type Thinker = "brene_brown" | "oprah" | "huberman" | "diary_of_ceo";

const thinkerStyles: Record<Thinker, string> = {
  brene_brown: "bg-amber-100 text-amber-800",
  oprah: "bg-purple-100 text-purple-800",
  huberman: "bg-sky-100 text-sky-800",
  diary_of_ceo: "bg-emerald-100 text-emerald-800",
};

const thinkerLabels: Record<Thinker, string> = {
  brene_brown: "Brené Brown",
  oprah: "Oprah Winfrey",
  huberman: "Andrew Huberman",
  diary_of_ceo: "Diary of a CEO",
};

interface BadgeProps {
  thinker?: Thinker;
  label?: string;
  className?: string;
}

export function Badge({ thinker, label, className }: BadgeProps) {
  const text = thinker ? thinkerLabels[thinker] : label ?? "";
  const style = thinker ? thinkerStyles[thinker] : "bg-[#F0E9DF] text-[#7A6655]";

  return (
    <span
      className={clsx(
        "inline-block rounded-full px-3 py-0.5 text-xs font-medium",
        style,
        className
      )}
    >
      {text}
    </span>
  );
}
