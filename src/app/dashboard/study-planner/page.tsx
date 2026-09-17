"use client";

import { useState } from "react";
import { CalendarClock, Loader2 } from "lucide-react";

export default function StudyPlannerPage() {
  const [subjects, setSubjects] = useState("");
  const [examDate, setExamDate] = useState("");
  const [plan, setPlan] = useState<{ content: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    if (!subjects.trim() || !examDate) return;
    setLoading(true);
    setError(null);
    const res = await fetch("/api/study-planner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subjects, examDate }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error ?? "Something went wrong.");
    setPlan(data.plan);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-white">
        <CalendarClock className="h-5 w-5 text-cyan" /> Study Planner
      </h1>
      <p className="mt-1 text-sm text-white/50">Turn deadlines into a plan.</p>

      <form onSubmit={generate} className="mt-6 space-y-3">
        <input
          value={subjects}
          onChange={(e) => setSubjects(e.target.value)}
          placeholder="Subjects — e.g. Physics, Chemistry, Maths"
          className="focus-ring w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30"
        />
        <input
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          className="focus-ring w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
        />
        <button
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan to-electric px-5 py-3 text-sm font-medium text-space-900 disabled:opacity-40"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Build my plan"}
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

      {plan && (
        <div className="card-surface mt-8 rounded-2xl p-6">
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-white/80">
            {plan.content}
          </div>
        </div>
      )}
    </div>
  );
}
