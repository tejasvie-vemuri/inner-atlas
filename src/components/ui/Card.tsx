import { clsx } from "clsx";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
}

export function Card({ elevated = false, className, children, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-[#E0D5C8] bg-white p-6",
        elevated && "shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
