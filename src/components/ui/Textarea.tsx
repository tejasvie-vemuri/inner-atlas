import { clsx } from "clsx";
import { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={clsx(
        "w-full rounded-xl border border-[#E0D5C8] bg-white px-4 py-3 text-sm text-[#2C1A0E] placeholder-[#7A6655] focus:outline-none focus:ring-2 focus:ring-[#C4843A]/30 focus:border-[#C4843A] resize-none transition-colors",
        className
      )}
      {...props}
    />
  );
}
