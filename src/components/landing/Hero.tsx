"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LogoMark } from "@/components/ui/Logo";
import { CosmicBackground } from "./CosmicBackground";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-24">
      <CosmicBackground />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan/70">
            An AI operating system for future builders
          </p>

          <h1 className="mt-5 font-display text-6xl font-bold leading-[0.95] sm:text-7xl">
            <span className="text-white">SEE</span>{" "}
            <span className="text-cyan">THINK</span>
            <br />
            <span className="text-white">CREATE.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg text-white/60">
            One connected space for how you learn, build, and grow — from
            the half-formed question to the thing you actually make.
          </p>

          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Button href="/sign-up" variant="primary" className="px-8 py-3.5 text-base">
              Get started <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="#tools" variant="outline" className="px-8 py-3.5 text-base">
              See how it works
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
          className="relative hidden aspect-square items-center justify-center lg:flex"
        >
          <div className="absolute inset-8 rounded-full border border-white/10" />
          <div className="absolute inset-16 rounded-full border border-white/5" />
          <div className="flex h-40 w-40 items-center justify-center rounded-full border border-cyan/30 bg-white/5 shadow-glow">
            <LogoMark className="h-20 w-auto" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
