"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Mail, Loader2, CheckCircle } from "lucide-react";

interface LoginClientProps {
  redirectTo?: string;
}

export function LoginClient({ redirectTo }: LoginClientProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || loading) return;
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirectTo ?? "/journal"}`,
      },
    });

    if (authError) {
      setError(authError.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center text-center py-10">
        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-5">
          <CheckCircle size={26} className="text-emerald-600" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#2C1A0E] mb-2">Check your email</h2>
        <p className="text-[#7A6655] text-sm max-w-sm">
          We sent a magic link to <strong>{email}</strong>. Click it to sign in — no password needed.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#2C1A0E] mb-1.5">
          Email address
        </label>
        <div className="relative">
          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A6655]" />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full rounded-xl border border-[#E0D5C8] bg-white pl-10 pr-4 py-2.5 text-sm text-[#2C1A0E] placeholder-[#7A6655] focus:outline-none focus:ring-2 focus:ring-[#C4843A]/30 focus:border-[#C4843A] transition-colors"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading || !email.trim()}
        className="w-full flex items-center justify-center gap-2 rounded-full bg-[#C4843A] px-5 py-3 text-sm font-medium text-white hover:bg-[#A36A2A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : "Send Magic Link"}
      </button>

      <p className="text-xs text-center text-[#7A6655]">
        No password needed — we&apos;ll email you a sign-in link.
      </p>
    </form>
  );
}
