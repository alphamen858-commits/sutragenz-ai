"use client";

import { useEffect, useRef, useState } from "react";
import { Video, Loader2 } from "lucide-react";

type Status = "idle" | "starting" | "PENDING" | "THROTTLED" | "RUNNING" | "SUCCEEDED" | "FAILED";

export default function VideoGenPage() {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;
    setError(null);
    setVideoUrl(null);
    setStatus("starting");

    const res = await fetch("/api/video-gen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
      setStatus("idle");
      return;
    }

    pollRef.current = setInterval(async () => {
      const pollRes = await fetch(`/api/video-gen/${data.taskId}`);
      const task = await pollRes.json();

      if (!pollRes.ok) {
        setError(task.error ?? "Lost track of the generation task.");
        setStatus("idle");
        if (pollRef.current) clearInterval(pollRef.current);
        return;
      }

      setStatus(task.status);

      if (task.status === "SUCCEEDED") {
        setVideoUrl(task.output?.[0] ?? null);
        if (pollRef.current) clearInterval(pollRef.current);
      }
      if (task.status === "FAILED" || task.status === "CANCELLED") {
        setError(task.failure ?? "Generation failed.");
        if (pollRef.current) clearInterval(pollRef.current);
      }
    }, 5000); // Runway asks for no more than one poll every 5 seconds
  }

  const isWorking = ["starting", "PENDING", "THROTTLED", "RUNNING"].includes(status);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-white">
        <Video className="h-5 w-5 text-electric" /> Video Generator
      </h1>
      <p className="mt-1 text-sm text-white/50">Direct the next frame.</p>

      <form onSubmit={generate} className="mt-6 flex gap-2">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the video you need…"
          className="focus-ring flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30"
        />
        <button
          disabled={isWorking}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan to-electric px-5 py-3 text-sm font-medium text-space-900 disabled:opacity-40"
        >
          {isWorking ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate"}
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

      {isWorking && (
        <div className="card-surface mt-8 flex flex-col items-center rounded-2xl p-12 text-center">
          <Loader2 className="h-6 w-6 animate-spin text-electric" />
          <p className="mt-3 text-sm text-white/50">
            {status === "starting" ? "Starting generation…" : `Status: ${status.toLowerCase()}…`}
          </p>
          <p className="mt-1 text-xs text-white/30">This usually takes 30s–2min.</p>
        </div>
      )}

      {videoUrl && (
        <div className="card-surface mt-8 overflow-hidden rounded-2xl">
          <video src={videoUrl} controls className="w-full" />
        </div>
      )}
    </div>
  );
}
