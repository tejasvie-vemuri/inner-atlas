import { Framework, THINKER_LABELS, THINKER_COLORS } from "@/lib/frameworks";
import { clsx } from "clsx";

interface FrameworkCardProps {
  framework: Framework;
  onClick?: () => void;
  compact?: boolean;
}

export function FrameworkCard({ framework, onClick, compact = false }: FrameworkCardProps) {
  const colors = THINKER_COLORS[framework.thinker];

  return (
    <div
      onClick={onClick}
      className={clsx(
        "rounded-2xl border border-[#E0D5C8] bg-white transition-all duration-200",
        onClick && "cursor-pointer hover:shadow-md hover:-translate-y-0.5",
        compact ? "p-4" : "p-6"
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <span
          className={clsx(
            "inline-block rounded-full px-3 py-0.5 text-xs font-medium",
            colors.bg,
            colors.text
          )}
        >
          {THINKER_LABELS[framework.thinker]}
        </span>
        <span className="inline-block rounded-full bg-[#F0E9DF] px-3 py-0.5 text-xs text-[#7A6655]">
          {framework.category.replace(/_/g, " ")}
        </span>
      </div>

      <h3 className={clsx("font-serif font-semibold text-[#2C1A0E] mb-2", compact ? "text-base" : "text-lg")}>
        {framework.title}
      </h3>

      <p className="text-sm text-[#7A6655] leading-relaxed line-clamp-3">{framework.summary}</p>

      {!compact && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {framework.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#FAF6F1] border border-[#E0D5C8] px-2.5 py-0.5 text-xs text-[#8B5E3C]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
