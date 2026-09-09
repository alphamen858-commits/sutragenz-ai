"use client";

import { useState } from "react";
import { ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";

export default function ImageGenPage() {
  const [prompt, setPrompt] = useState("");
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setUrl(null);
    const res = await fetch("/api/image-gen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error ?? "Something went wrong.");
    setUrl(data.url);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-white">
        <ImageIcon className="h-5 w-5 text-violet" /> Image Generator
      </h1>
      <p className="mt-1 text-sm text-white/50">Make the vision visible.</p>

      <form onSubmit={generate} className="mt-6 flex gap-2">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you need…"
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

      {url && (
        <div className="card-surface mt-8 overflow-hidden rounded-2xl">
          <Image src={url} alt={prompt} width={1024} height={1024} className="w-full" unoptimized />
        </div>
      )}
    </div>
  );
}
