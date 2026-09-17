"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FEATURES } from "@/data/features";
import { cn } from "@/lib/utils";
import { AICore } from "./three/AICore";

const RADIUS = 260; // px, desktop orbit radius
const SIZE = 640; // px, container square size

export function ToolOrbitSection() {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const positioned = useMemo(
    () =>
      FEATURES.map((f, i) => {
        const angle = (i / FEATURES.length) * Math.PI * 2 - Math.PI / 2;
        // Rounded to 2 decimals — full float precision can render as a
        // slightly different string on the server vs. the browser,
        // which React's hydration check treats as a mismatch.
        const x = Math.round(Math.cos(angle) * RADIUS * 100) / 100;
        const y = Math.round(Math.sin(angle) * RADIUS * 100) / 100;
        return { ...f, x, y, angle };
      }),
    []
  );

  return (
    <section id="tools" className="relative mx-auto max-w-6xl px-6 py-24">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-electric/70">
          One core, thirteen directions
        </p>
        <h2 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl">
          Every tool, connected to one core
        </h2>
        <p className="mt-4 text-white/55">
          Start anywhere. Every tool feeds back into the same workspace, the
          same history, the same you.
        </p>
      </div>

      {/* Desktop: orbit layout */}
      <div
        className="relative mx-auto hidden select-none lg:block"
        style={{ width: SIZE, height: SIZE }}
      >
        <svg
          className="pointer-events-none absolute inset-0"
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
        >
          {positioned.map((f) => {
            const cx = SIZE / 2;
            const cy = SIZE / 2;
            const isActive = activeKey === f.key;
            return (
              <line
                key={f.key}
                x1={cx}
                y1={cy}
                x2={cx + f.x}
                y2={cy + f.y}
                stroke={isActive ? "#00F5FF" : "rgba(255,255,255,0.08)"}
                strokeWidth={isActive ? 1.5 : 1}
                strokeDasharray="4 5"
                className={isActive ? "animate-[dash_1.2s_linear_infinite]" : undefined}
              />
            );
          })}
        </svg>

        <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2">
          <AICore className="h-full w-full" />
        </div>

        {positioned.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.key}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.03 }}
              className="absolute left-1/2 top-1/2 w-40"
              style={{ transform: `translate(calc(-50% + ${f.x}px), calc(-50% + ${f.y}px))` }}
              onMouseEnter={() => setActiveKey(f.key)}
              onMouseLeave={() => setActiveKey(null)}
            >
              <Link
                href={f.href}
                className={cn(
                  "card-surface block rounded-xl p-3 text-center transition-all duration-200 hover:-translate-y-1 hover:border-cyan/40 hover:shadow-glow focus-ring",
                  activeKey === f.key && "border-cyan/40 shadow-glow"
                )}
              >
                <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-cyan">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="mt-2 block text-xs font-medium text-white">{f.name}</span>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile / tablet: simple accessible list, same data, no orbit geometry */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:hidden">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <Link
              key={f.key}
              href={f.href}
              className="card-surface flex items-center gap-3 rounded-xl p-4 transition-transform hover:-translate-y-0.5 focus-ring"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-cyan">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <div className="text-sm font-medium text-white">{f.name}</div>
                <div className="text-xs text-white/45">{f.tagline}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
