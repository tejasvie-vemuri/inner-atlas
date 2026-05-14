import { CoachClient } from "./CoachClient";
import { Suspense } from "react";

export const metadata = {
  title: "AI Life Coach — Inner Atlas",
  description: "Chat with an AI life coach grounded in frameworks from Brené Brown, Oprah, Huberman, and Diary of a CEO.",
};

function CoachWithParams({ searchParams }: { searchParams: Record<string, string> }) {
  return <CoachClient initialFrameworkId={searchParams.framework} />;
}

export default async function CoachPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-bold text-[#2C1A0E] mb-1">AI Life Coach</h1>
        <p className="text-sm text-[#7A6655]">
          Every response draws from frameworks by Brené Brown, Oprah, Andrew Huberman, and Steven Bartlett.
        </p>
      </div>
      <Suspense>
        <CoachWithParams searchParams={params} />
      </Suspense>
    </div>
  );
}
