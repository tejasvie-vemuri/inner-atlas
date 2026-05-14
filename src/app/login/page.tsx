import { LoginClient } from "./LoginClient";

export const metadata = {
  title: "Sign In — Inner Atlas",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="text-center mb-10">
        <h1 className="font-serif text-4xl font-bold text-[#2C1A0E] mb-3">Welcome back</h1>
        <p className="text-[#7A6655] text-sm">
          Sign in to access your journal and notes. Your second brain is waiting.
        </p>
      </div>
      <div className="rounded-2xl border border-[#E0D5C8] bg-white p-8">
        <LoginClient redirectTo={params.redirect} />
      </div>
    </div>
  );
}
