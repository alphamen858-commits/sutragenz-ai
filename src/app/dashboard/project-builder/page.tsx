"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Blocks, Loader2, Download, Rocket, ExternalLink } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const ProjectPreview = dynamic(
  () => import("@/components/playground/ProjectPreview").then((m) => m.ProjectPreview),
  { ssr: false, loading: () => <div className="card-surface h-[480px] animate-pulse rounded-2xl" /> }
);

export default function ProjectBuilderPage() {
  const [idea, setIdea] = useState("");
  const [result, setResult] = useState<{ id: string; title: string; files: Record<string, string> } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deploying, setDeploying] = useState(false);
  const [deployUrl, setDeployUrl] = useState<string | null>(null);
  const [deployError, setDeployError] = useState<string | null>(null);

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    if (!idea.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setDeployUrl(null);
    setDeployError(null);
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

  async function downloadZip() {
    if (!result) return;
    const zip = new JSZip();
    Object.entries(result.files).forEach(([path, content]) => {
      zip.file(path.replace(/^\//, ""), content);
    });
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, `${result.title.replace(/\s+/g, "-").toLowerCase()}.zip`);
  }

  async function deploy() {
    if (!result) return;
    setDeploying(true);
    setDeployError(null);
    const res = await fetch("/api/deploy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: result.id }),
    });
    const data = await res.json();
    setDeploying(false);
    if (!res.ok) return setDeployError(data.error ?? "Deployment failed.");
    setDeployUrl(data.url);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-white">
        <Blocks className="h-5 w-5 text-cyan" /> AI Project Builder
      </h1>
      <p className="mt-1 text-sm text-white/50">
        Describe an app — get real, working, multi-file React code with a live preview.
      </p>

      <form onSubmit={generate} className="mt-6 flex gap-2">
        <input
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="e.g. A habit tracker with streaks and a progress bar"
          className="focus-ring flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30"
        />
        <button
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan to-electric px-5 py-3 text-sm font-medium text-space-900 disabled:opacity-40"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Build it"}
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      {loading && <p className="mt-4 text-sm text-white/40">Generating your project — this can take 15-30s...</p>}

      {result && (
        <div className="mt-8">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-display text-lg font-medium text-white">{result.title}</h3>
            <div className="flex gap-2">
              <button
                onClick={downloadZip}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/70 hover:text-white"
              >
                <Download className="h-3.5 w-3.5" /> Download ZIP
              </button>
              <button
                onClick={deploy}
                disabled={deploying}
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan to-electric px-3 py-1.5 text-xs font-medium text-space-900 disabled:opacity-40"
              >
                {deploying ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Rocket className="h-3.5 w-3.5" />}
                Deploy to Vercel
              </button>
            </div>
          </div>

          {deployError && <p className="mb-3 text-sm text-red-400">{deployError}</p>}
          {deployUrl && (
            <a
              href={deployUrl}
              target="_blank"
              rel="noreferrer"
              className="mb-3 flex items-center gap-2 text-sm text-cyan hover:underline"
            >
              <ExternalLink className="h-4 w-4" /> Live at {deployUrl}
            </a>
          )}

          <ProjectPreview files={result.files} />
        </div>
      )}
    </div>
  );
}
