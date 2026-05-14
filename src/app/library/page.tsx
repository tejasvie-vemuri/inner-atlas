import { LibraryClient } from "./LibraryClient";

export const metadata = {
  title: "Framework Library — Inner Atlas",
  description: "40 distilled frameworks from Brené Brown, Oprah Winfrey, Andrew Huberman, and Diary of a CEO.",
};

export default function LibraryPage() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="font-serif text-4xl font-bold text-[#2C1A0E] mb-3">Framework Library</h1>
        <p className="text-[#7A6655] max-w-xl">
          40 distilled frameworks from four transformational thinkers. Search, filter, and dive
          deep — then take one into your journal or explore it with the AI coach.
        </p>
      </div>

      <LibraryClient />
    </div>
  );
}
