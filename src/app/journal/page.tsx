import { JournalClient } from "./JournalClient";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Journal — Inner Atlas",
  description: "Reflect on daily prompts drawn from your favourite frameworks.",
};

function JournalWithParams({ searchParams }: { searchParams: Record<string, string> }) {
  return <JournalClient initialFrameworkId={searchParams.framework} />;
}

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-[#2C1A0E] mb-2">Daily Journal</h1>
        <p className="text-[#7A6655] text-sm">
          Each entry is anchored to a framework prompt. Write freely — this is only for you.
        </p>
      </div>
      <Suspense>
        <JournalWithParams searchParams={params} />
      </Suspense>
    </div>
  );
}
