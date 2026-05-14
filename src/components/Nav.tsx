"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { BookOpen, MessageCircle, BookMarked, StickyNote, Home } from "lucide-react";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/library", label: "Library", icon: BookOpen },
  { href: "/coach", label: "Coach", icon: MessageCircle },
  { href: "/journal", label: "Journal", icon: BookMarked },
  { href: "/notes", label: "Notes", icon: StickyNote },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-[#E0D5C8] bg-[#FAF6F1]/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-xl font-bold text-[#2C1A0E]">
          Inner Atlas
        </Link>

        <div className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                pathname === href
                  ? "bg-[#C4843A] text-white"
                  : "text-[#7A6655] hover:bg-[#F0E9DF] hover:text-[#2C1A0E]"
              )}
            >
              <Icon size={15} />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
