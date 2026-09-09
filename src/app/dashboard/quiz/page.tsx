"use client";

import { useState } from "react";
import { ListChecks, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export default function QuizPage() {
  const [topic, setTopic] = useState("");
  const [quiz, setQuiz] = useState<{ id: string; title: string; questions: Question[] } | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setError(null);
    setSubmitted(false);
    const res = await fetch("/api/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, count: 5 }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error ?? "Something went wrong.");
    setQuiz(data.quiz);
    setAnswers(new Array(data.quiz.questions.length).fill(-1));
  }

  async function submit() {
    if (!quiz) return;
    const score = answers.reduce(
      (acc, a, i) => acc + (a === quiz.questions[i].answer ? 1 : 0),
      0
    );
    setSubmitted(true);
    await fetch(`/api/quiz/${quiz.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score }),
    });
  }

  const score = quiz
    ? answers.reduce((acc, a, i) => acc + (a === quiz.questions[i].answer ? 1 : 0), 0)
    : 0;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-white">
        <ListChecks className="h-5 w-5 text-electric" /> Quiz Generator
      </h1>
      <p className="mt-1 text-sm text-white/50">Find out what you actually know.</p>

      <form onSubmit={generate} className="mt-6 flex gap-2">
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. Photosynthesis"
          className="focus-ring flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30"
        />
        <button
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan to-electric px-5 py-3 text-sm font-medium text-space-900 disabled:opacity-40"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate quiz"}
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

      {quiz && (
        <div className="mt-8 space-y-6">
          {quiz.questions.map((q, qi) => (
            <div key={qi} className="card-surface rounded-2xl p-6">
              <p className="font-medium text-white">{qi + 1}. {q.question}</p>
              <div className="mt-3 space-y-2">
                {q.options.map((opt, oi) => {
                  const isSelected = answers[qi] === oi;
                  const isCorrect = submitted && oi === q.answer;
                  const isWrongPick = submitted && isSelected && oi !== q.answer;
                  return (
                    <button
                      key={oi}
                      disabled={submitted}
                      onClick={() => {
                        const next = [...answers];
                        next[qi] = oi;
                        setAnswers(next);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-left text-sm transition-colors",
                        isSelected ? "border-cyan/40 bg-cyan/5" : "border-white/10 hover:border-white/25",
                        isCorrect && "border-green-400/50 bg-green-400/10",
                        isWrongPick && "border-red-400/50 bg-red-400/10"
                      )}
                    >
                      <span className="text-white/80">{opt}</span>
                      {isCorrect && <CheckCircle2 className="h-4 w-4 text-green-400" />}
                      {isWrongPick && <XCircle className="h-4 w-4 text-red-400" />}
                    </button>
                  );
                })}
              </div>
              {submitted && (
                <p className="mt-3 text-xs text-white/45">{q.explanation}</p>
              )}
            </div>
          ))}

          {!submitted ? (
            <button
              onClick={submit}
              disabled={answers.includes(-1)}
              className="w-full rounded-xl bg-gradient-to-r from-cyan to-electric py-3 text-sm font-medium text-space-900 disabled:opacity-40"
            >
              Submit answers
            </button>
          ) : (
            <div className="card-surface rounded-2xl p-6 text-center">
              <p className="font-display text-2xl font-semibold text-white">
                {score} / {quiz.questions.length}
              </p>
              <p className="mt-1 text-sm text-white/50">+10 XP for completing this quiz</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
