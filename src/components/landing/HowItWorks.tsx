"use client";

import { motion } from "framer-motion";
import { UserPlus, MessagesSquare, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create your workspace",
    desc: "Sign up free — no credit card. Your profile, XP, and streak start tracking from day one.",
  },
  {
    icon: MessagesSquare,
    title: "Ask, build, generate",
    desc: "Open any of the 13 tools — Tutor, Coding Assistant, Notes, Quiz, and more — all sharing one history.",
  },
  {
    icon: TrendingUp,
    title: "See yourself improve",
    desc: "Every session feeds your progress — XP, streaks, saved notes, and a growing project history.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative mx-auto max-w-6xl px-6 py-24">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan/70">How it works</p>
        <h2 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl">
          Three steps. No setup headaches.
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="card-surface rounded-2xl p-8"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-cyan">
              <s.icon className="h-5 w-5" />
            </div>
            <div className="mt-4 text-xs font-medium text-white/30">Step {i + 1}</div>
            <h3 className="mt-1 font-display text-lg font-medium text-white">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/55">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
