"use client";

import { Framework, THINKER_LABELS, THINKER_COLORS } from "@/lib/frameworks";
import { X, BookOpen, MessageCircle } from "lucide-react";
import { clsx } from "clsx";
import Link from "next/link";
import { useEffect } from "react";

interface FrameworkModalProps {
  framework: Framework;
  onClose: () => void;
}

export function FrameworkModal({ framework, onClose }: FrameworkModalProps) {
  const colors = THINKER_COLORS[framework.thinker];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C1A0E]/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#E0D5C8] px-8 py-5 flex items-start justify-between gap-4 rounded-t-3xl">
          <div>
            <span className={clsx("inline-block rounded-full px-3 py-0.5 text-xs font-medium mb-2", colors.bg, colors.text)}>
              {THINKER_LABELS[framework.thinker]}
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#2C1A0E]">{framework.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="mt-1 p-2 rounded-full text-[#7A6655] hover:bg-[#F0E9DF] transition-colors flex-shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-6 space-y-6">
          {/* Summary */}
          <p className="text-base font-medium text-[#8B5E3C] italic leading-relaxed border-l-2 border-[#C4843A] pl-4">
            {framework.summary}
          </p>

          {/* Full description */}
          <div>
            <p className="text-sm text-[#7A6655] leading-7">{framework.fullDescription}</p>
          </div>

          {/* Source */}
          <div className="flex items-start gap-2 text-xs text-[#7A6655]">
            <BookOpen size={14} className="mt-0.5 flex-shrink-0" />
            <span>{framework.source}</span>
          </div>

          {/* Reflection prompt */}
          <div className="rounded-2xl bg-[#FAF6F1] border border-[#E0D5C8] p-5">
            <p className="text-xs font-medium text-[#C4843A] uppercase tracking-wider mb-2">Reflection Prompt</p>
            <p className="text-sm text-[#2C1A0E] leading-relaxed">{framework.prompt}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {framework.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#F0E9DF] border border-[#E0D5C8] px-3 py-0.5 text-xs text-[#8B5E3C]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="flex gap-3 pt-2">
            <Link
              href={`/coach?framework=${framework.id}`}
              onClick={onClose}
              className="flex items-center gap-2 rounded-full bg-[#C4843A] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#A36A2A] transition-colors"
            >
              <MessageCircle size={15} />
              Explore with Coach
            </Link>
            <Link
              href={`/journal?framework=${framework.id}`}
              onClick={onClose}
              className="flex items-center gap-2 rounded-full border border-[#E0D5C8] bg-white px-5 py-2.5 text-sm font-medium text-[#2C1A0E] hover:bg-[#F0E9DF] transition-colors"
            >
              Journal on this
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
