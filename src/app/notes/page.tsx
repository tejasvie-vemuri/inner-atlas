import { NotesClient } from "./NotesClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Notes — Inner Atlas",
  description: "Your personal brainstorming and reflection space, linked to the frameworks you love.",
};

export default function NotesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-[#2C1A0E] mb-2">My Notes</h1>
        <p className="text-[#7A6655] text-sm">
          Brainstorm freely. Link ideas to frameworks. Tag and find them later.
        </p>
      </div>
      <NotesClient />
    </div>
  );
}
