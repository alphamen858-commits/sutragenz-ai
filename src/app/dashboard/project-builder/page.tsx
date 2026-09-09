"use client";

import { useState } from "react";
import { Blocks, Loader2 } from "lucide-react";

export default function ProjectBuilderPage() {
  const [idea, setIdea] = useState("");
  const [result, setResult] = useState<{ title: string; description: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    if (!idea.trim()) return;
    setLoading(true);
    setError(null);
    const res = await fetch("/api/project-builder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error ?? "Something went wrong.");
    setResult(data.project);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-white">
        <Blocks className="h-5 w-5 text-cyan" /> AI Project Builder
      </h1>
      <p className="mt-1 text-sm text-white/50">From thought to prototype.</p>

      <form onSubmit={generate} className="mt-6 flex gap-2">
        <input
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="e.g. A habit tracker with streaks"
          className="focus-ring flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30"
        />
        <button
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan to-electric px-5 py-3 text-sm font-medium text-space-900 disabled:opacity-40"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Scaffold it"}
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

      {result && (
        <div className="card-surface mt-8 rounded-2xl p-6">
          <h3 className="font-display text-base font-medium text-white">{result.title}</h3>
          <div className="prose prose-invert prose-sm mt-3 max-w-none whitespace-pre-wrap text-white/70">
            {result.description}
          </div>
          <a href="/dashboard/playground" className="mt-4 inline-block text-sm text-cyan hover:underline">
            Continue building in the Playground →
          </a>
        </div>
      )}
    </div>
  );
}
