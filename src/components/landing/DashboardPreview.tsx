"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Flame, MessageSquare, NotebookPen, ListChecks, Trophy } from "lucide-react";

// A static, realistic mockup of the real dashboard — not the live app, but
// built from the same data shapes (XP, streak, chats, notes, quizzes,
// achievements) so it accurately represents what's actually inside.
export function DashboardPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -6, y: px * 8 });
  }

  return (
    <section id="dashboard" className="relative mx-auto max-w-6xl px-6 py-24">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-violet/70">
          See it in action
        </p>
        <h2 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl">
          One workspace, everything in view
        </h2>
        <p className="mt-4 text-white/55">
          Chats, notes, quizzes, and progress — all in the same place, all
          feeding the same picture of how you're actually doing.
        </p>
      </div>

      <div className="perspective-container">
        <motion.div
          ref={ref}
          onMouseMove={handleMove}
          onMouseLeave={() => setTilt({ x: 0, y: 0 })}
          animate={{ rotateX: tilt.x, rotateY: tilt.y }}
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
          className="card-surface mx-auto overflow-hidden rounded-2xl shadow-glow"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* fake topbar */}
          <div className="flex items-center justify-between border-b border-white/5 px-6 py-3">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            </div>
            <div className="flex items-center gap-4 text-xs text-white/50">
              <span className="flex items-center gap-1"><Sparkles className="h-3.5 w-3.5 text-cyan" /> 240 XP</span>
              <span className="flex items-center gap-1"><Flame className="h-3.5 w-3.5 text-orange-400" /> 6 day streak</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr]">
            {/* fake sidebar */}
            <div className="hidden border-r border-white/5 p-4 text-xs text-white/40 sm:block">
              <div className="mb-1 rounded-lg bg-white/8 px-3 py-2 text-white">Home</div>
              <div className="px-3 py-2">AI Tutor</div>
              <div className="px-3 py-2">Coding Assistant</div>
              <div className="px-3 py-2">Notes Generator</div>
              <div className="px-3 py-2">Quiz Generator</div>
            </div>

            {/* fake content */}
            <div className="space-y-4 p-6">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { icon: MessageSquare, label: "Conversations", value: "18" },
                  { icon: NotebookPen, label: "Notes saved", value: "7" },
                  { icon: ListChecks, label: "Quizzes taken", value: "5" },
                  { icon: Trophy, label: "Achievements", value: "3" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                    <s.icon className="h-4 w-4 text-cyan" />
                    <div className="mt-2 font-display text-lg font-semibold text-white">{s.value}</div>
                    <div className="text-[11px] text-white/40">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
                <div className="mb-3 text-xs text-white/40">AI Tutor</div>
                <div className="ml-auto mb-2 max-w-[70%] rounded-2xl bg-electric/10 px-3 py-2 text-xs text-white/80">
                  Can you break down photosynthesis for me?
                </div>
                <div className="max-w-[70%] rounded-2xl bg-white/5 px-3 py-2 text-xs text-white/70">
                  Sure — think of it in three stages: light capture, energy
                  conversion, and sugar production...
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
