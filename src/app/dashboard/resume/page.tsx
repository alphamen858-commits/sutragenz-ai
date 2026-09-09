"use client";

import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";

export default function ResumePage() {
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [result, setResult] = useState<{ title: string; content: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    if (!role.trim() || !experience.trim()) return;
    setLoading(true);
    setError(null);
    const res = await fetch("/api/resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, experience }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error ?? "Something went wrong.");
    setResult(data.resume);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-white">
        <FileText className="h-5 w-5 text-cyan" /> Resume Builder
      </h1>
      <p className="mt-1 text-sm text-white/50">Say more with less.</p>

      <form onSubmit={generate} className="mt-6 space-y-3">
        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Target role — e.g. Frontend Developer Intern"
          className="focus-ring w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30"
        />
        <textarea
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="Paste your experience, projects, and skills — rough notes are fine."
          rows={6}
          className="focus-ring w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30"
        />
        <button
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan to-electric px-5 py-3 text-sm font-medium text-space-900 disabled:opacity-40"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Build resume"}
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

      {result && (
        <div className="card-surface mt-8 rounded-2xl p-6">
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-white/80">
            {result.content}
          </div>
        </div>
      )}
    </div>
  );
}
