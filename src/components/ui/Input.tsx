import { clsx } from "clsx";
import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={clsx(
        "w-full rounded-xl border border-[#E0D5C8] bg-white px-4 py-2.5 text-sm text-[#2C1A0E] placeholder-[#7A6655] focus:outline-none focus:ring-2 focus:ring-[#C4843A]/30 focus:border-[#C4843A] transition-colors",
        className
      )}
      {...props}
    />
  );
}
