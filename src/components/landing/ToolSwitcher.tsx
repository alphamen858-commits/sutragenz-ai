"use client";

import { useState } from "react";
import { FEATURES } from "@/data/features";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

export function ToolSwitcher() {
  const [activeKey, setActiveKey] = useState(FEATURES[0].key);
  const active = FEATURES.find((f) => f.key === activeKey) ?? FEATURES[0];
  const ActiveIcon = active.icon;

  return (
    <section id="tools" className="relative mx-auto max-w-6xl px-6 py-24">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-electric/70">
        One orbit, many doors
      </p>
      <div className="mt-4 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
          Choose a direction.
          <br />
          Keep your <span className="text-gradient">momentum</span>.
        </h2>
        <p className="max-w-sm text-sm text-white/50">
          A single idea rarely stays in one lane. Start anywhere, then follow
          the signal into the tool that fits the next move.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,320px)_1fr]">
        {/* tool list */}
        <div className="card-surface max-h-[420px] overflow-y-auto rounded-2xl p-2">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            const isActive = f.key === activeKey;
            return (
              <button
                key={f.key}
                onClick={() => setActiveKey(f.key)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors",
                  isActive ? "bg-white/8 border border-cyan/30" : "border border-transparent hover:bg-white/5"
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5",
                    isActive && "text-cyan border-cyan/30"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-medium text-white">{f.name}</span>
                  <span className="block text-xs text-white/45">{f.tagline}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* preview panel */}
        <div className="card-surface flex flex-col justify-between rounded-2xl bg-gradient-to-br from-electric/10 via-space-800 to-violet/10 p-8">
          <div>
            <div className="flex items-center justify-between text-xs uppercase tracking-widest text-white/35">
              <span>Sutragenz / {active.name}</span>
              <span className="flex items-center gap-1.5 text-cyan/80">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan" /> Ready
              </span>
            </div>

            <div className="mt-8 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-cyan">
              <ActiveIcon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-2xl font-semibold text-white">{active.name}</h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/55">{active.description}</p>
          </div>

          <a
            href={active.href}
            className="mt-8 flex items-center justify-between rounded-xl border border-white/10 bg-space-900/60 px-5 py-4 text-sm text-white/70 transition-colors hover:border-cyan/40 hover:text-white"
          >
            <span>Open {active.name}</span>
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
