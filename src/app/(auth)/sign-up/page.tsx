"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { CosmicBackground } from "@/components/landing/CosmicBackground";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error?.formErrors?.[0] ?? data.error ?? "Something went wrong.");
      setLoading(false);
      return;
    }

    const signInRes = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);
    if (signInRes?.ok) router.push("/dashboard");
    else router.push("/sign-in");
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
          Start here.
        </h1>
        <p className="mt-2 text-center text-sm text-white/50">
          Free to join — see, think, create in minutes.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs text-white/50">Full name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="focus-ring w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30"
              placeholder="Ada Lovelace"
            />
          </div>
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
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="focus-ring w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30"
              placeholder="At least 8 characters"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="mt-4 w-full rounded-xl border border-white/10 py-3 text-sm text-white/70 transition-colors hover:border-white/25 hover:text-white"
        >
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-white/40">
          Already have an account?{" "}
          <a href="/sign-in" className="text-cyan hover:underline">Log in</a>
        </p>
      </motion.div>
    </main>
  );
}
