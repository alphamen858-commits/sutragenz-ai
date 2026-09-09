"use client";

import { useState } from "react";
import { NotebookPen, Loader2 } from "lucide-react";

export default function NotesPage() {
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState<{ id: string; title: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setError(null);
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error ?? "Something went wrong.");
    setNotes((n) => [data.note, ...n]);
    setTopic("");
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-white">
        <NotebookPen className="h-5 w-5 text-violet" /> Notes Generator
      </h1>
      <p className="mt-1 text-sm text-white/50">Worth keeping, not just taking.</p>

      <form onSubmit={generate} className="mt-6 flex gap-2">
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. Newton's laws of motion"
          className="focus-ring flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30"
        />
        <button
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan to-electric px-5 py-3 text-sm font-medium text-space-900 disabled:opacity-40"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate"}
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

      <div className="mt-8 space-y-4">
        {notes.map((n) => (
          <div key={n.id} className="card-surface rounded-2xl p-6">
            <h3 className="font-display text-base font-medium text-white">{n.title}</h3>
            <div className="prose prose-invert prose-sm mt-3 max-w-none whitespace-pre-wrap text-white/70">
              {n.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
