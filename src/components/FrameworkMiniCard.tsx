"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Framework } from "@/lib/frameworks/types";
import { THINKER_LABELS, THINKER_COLORS, THINKER_PHOTOS } from "@/lib/frameworks";

interface FrameworkMiniCardProps {
  framework: Framework;
  onClick?: () => void;
}

export function FrameworkMiniCard({ framework, onClick }: FrameworkMiniCardProps) {
  const [imgError, setImgError] = useState(false);
  const colors = THINKER_COLORS[framework.thinker];
  const photo = THINKER_PHOTOS[framework.thinker];
  const label = THINKER_LABELS[framework.thinker];
  const initials = label
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-center gap-3 rounded-2xl border border-[#E0D5C8] bg-white hover:bg-[#FAF6F1] transition-colors px-3.5 py-3 group"
    >
      {/* Thinker photo */}
      <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
        {!imgError ? (
          <img
            src={photo}
            alt={label}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center text-xs font-bold ${colors.bg} ${colors.text}`}
          >
            {initials}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span
            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${colors.bg} ${colors.text}`}
          >
            {label}
          </span>
        </div>
        <p className="text-sm font-semibold text-[#2C1A0E] leading-snug truncate">
          {framework.title}
        </p>
        <p className="text-xs text-[#7A6655] leading-relaxed mt-0.5 line-clamp-1">
          {framework.summary}
        </p>
      </div>

      {/* Arrow */}
      <ArrowRight
        size={14}
        className="text-[#C4843A] flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </button>
  );
}
