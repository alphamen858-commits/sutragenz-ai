"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { CosmicBackground } from "@/components/landing/CosmicBackground";

export default function SignInPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);
    if (res?.ok) router.push("/dashboard");
    else setError("Incorrect email or password.");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-space-900 px-6">
      <CosmicBackground />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card-surface relative z-10 w-full max-w-md rounded-2xl p-8"
      >
        <Logo className="mb-8 justify-center" />
        <h1 className="text-center font-display text-2xl font-semibold text-white">
          Welcome back.
        </h1>
        <p className="mt-2 text-center text-sm text-white/50">Log in to keep your momentum.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs text-white/50">Email</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="focus-ring w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30"
              placeholder="you@school.edu"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-white/50">Password</label>
            <input
              required
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="focus-ring w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? "Logging in…" : "Log in"}
          </Button>
        </form>

        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="mt-4 w-full rounded-xl border border-white/10 py-3 text-sm text-white/70 transition-colors hover:border-white/25 hover:text-white"
        >
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-white/40">
          New here?{" "}
          <a href="/sign-up" className="text-cyan hover:underline">Create an account</a>
        </p>
      </motion.div>
    </main>
  );
}
