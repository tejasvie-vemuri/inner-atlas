import Link from "next/link";
import { BookOpen, MessageCircle, BookMarked, StickyNote, ArrowRight } from "lucide-react";
import { getDailyFramework, ALL_FRAMEWORKS, THINKER_LABELS, THINKER_COLORS } from "@/lib/frameworks";
import { FrameworkCard } from "@/components/FrameworkCard";

const QUOTES = [
  { text: "Vulnerability is the birthplace of innovation, creativity, and change.", author: "Brené Brown" },
  { text: "The biggest adventure you can take is to live the life of your dreams.", author: "Oprah Winfrey" },
  { text: "You don't have to be extreme. You have to be consistent.", author: "Andrew Huberman" },
  { text: "The story you tell yourself about who you are determines everything.", author: "Steven Bartlett" },
  { text: "Owning our story and loving ourselves through that process is the bravest thing we'll ever do.", author: "Brené Brown" },
  { text: "What I know for sure is that speaking your truth is the most powerful tool we all have.", author: "Oprah Winfrey" },
];

const TILES = [
  {
    href: "/library",
    icon: BookOpen,
    label: "Framework Library",
    desc: "40 frameworks from 4 thinkers",
    color: "bg-amber-50 text-amber-700",
  },
  {
    href: "/coach",
    icon: MessageCircle,
    label: "AI Life Coach",
    desc: "Chat grounded in the frameworks",
    color: "bg-purple-50 text-purple-700",
  },
  {
    href: "/journal",
    icon: BookMarked,
    label: "Daily Journal",
    desc: "Reflect on today's prompt",
    color: "bg-sky-50 text-sky-700",
  },
  {
    href: "/notes",
    icon: StickyNote,
    label: "My Notes",
    desc: "Brainstorm & link frameworks",
    color: "bg-emerald-50 text-emerald-700",
  },
];

function getDailyQuote(): (typeof QUOTES)[0] {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return QUOTES[dayOfYear % QUOTES.length];
}

export default function HomePage() {
  const todayFramework = getDailyFramework();
  const quote = getDailyQuote();
  const colors = THINKER_COLORS[todayFramework.thinker];

  const featuredIdx = (ALL_FRAMEWORKS.indexOf(todayFramework) + 13) % ALL_FRAMEWORKS.length;
  const featured = ALL_FRAMEWORKS[featuredIdx];

  return (
    <div className="space-y-12">
      {/* Hero */}
      <div>
        <p className="text-sm text-[#C4843A] font-medium mb-2 uppercase tracking-wider">Your Second Brain</p>
        <h1 className="font-serif text-5xl font-bold text-[#2C1A0E] mb-4 leading-tight">
          Inner Atlas
        </h1>
        <p className="text-lg text-[#7A6655] max-w-lg">
          Distilled wisdom from Brené Brown, Oprah Winfrey, Andrew Huberman, and Diary of a CEO —
          searchable, livable, and always with you.
        </p>
      </div>

      {/* Quote of the day */}
      <div className="rounded-2xl bg-[#2C1A0E] text-white px-8 py-7">
        <p className="text-xs text-[#C4843A] uppercase tracking-wider mb-3">Quote of the Day</p>
        <blockquote className="font-serif text-xl font-medium leading-relaxed mb-3">
          &ldquo;{quote.text}&rdquo;
        </blockquote>
        <p className="text-sm text-[#C4843A]">— {quote.author}</p>
      </div>

      {/* Today's Framework Prompt */}
      <div>
        <p className="text-xs text-[#7A6655] uppercase tracking-wider mb-4">Today&apos;s Framework</p>
        <div className="rounded-2xl border border-[#E0D5C8] bg-white p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className={`rounded-full px-3 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}>
              {THINKER_LABELS[todayFramework.thinker]}
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#2C1A0E] mb-2">{todayFramework.title}</h2>
          <p className="text-[#7A6655] text-sm leading-relaxed mb-5">{todayFramework.summary}</p>

          <div className="rounded-xl bg-[#FAF6F1] border border-[#E0D5C8] p-4 mb-5">
            <p className="text-xs font-medium text-[#C4843A] uppercase tracking-wider mb-1.5">Reflect on this</p>
            <p className="text-sm text-[#2C1A0E] leading-relaxed">{todayFramework.prompt}</p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Link
              href={`/journal?framework=${todayFramework.id}`}
              className="flex items-center gap-2 rounded-full bg-[#C4843A] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#A36A2A] transition-colors"
            >
              Journal on this <ArrowRight size={14} />
            </Link>
            <Link
              href={`/coach?framework=${todayFramework.id}`}
              className="flex items-center gap-2 rounded-full border border-[#E0D5C8] px-5 py-2.5 text-sm font-medium text-[#2C1A0E] hover:bg-[#F0E9DF] transition-colors"
            >
              Ask the Coach
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Access Tiles */}
      <div>
        <p className="text-xs text-[#7A6655] uppercase tracking-wider mb-4">Explore</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TILES.map(({ href, icon: Icon, label, desc, color }) => (
            <Link
              key={href}
              href={href}
              className="rounded-2xl border border-[#E0D5C8] bg-white p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                <Icon size={18} />
              </div>
              <p className="font-medium text-[#2C1A0E] text-sm mb-0.5">{label}</p>
              <p className="text-xs text-[#7A6655]">{desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Framework */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-[#7A6655] uppercase tracking-wider">Featured Framework</p>
          <Link href="/library" className="text-xs text-[#C4843A] hover:underline flex items-center gap-1">
            View all 40 <ArrowRight size={12} />
          </Link>
        </div>
        <FrameworkCard framework={featured} />
      </div>
    </div>
  );
}
