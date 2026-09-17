"use client";

import { motion } from "framer-motion";
import { ArrowRight, Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AICore } from "./three/AICore";
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
            See · Think · Create
          </p>

          <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] sm:text-6xl">
            Your AI <span className="text-gradient">Operating System</span>
            <br />
            for Learning
          </h1>

          <p className="mt-6 max-w-lg text-lg text-white/60">
            Sutragenz.ai brings tutoring, coding, research, career coaching,
            and a full creative toolkit into one connected workspace built
            for students and future builders.
          </p>

          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Button href="/sign-up" variant="primary" className="px-8 py-3.5 text-base">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="#tools" variant="outline" className="px-8 py-3.5 text-base">
              <Compass className="h-4 w-4" /> Explore Tools
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
          className="relative hidden aspect-square items-center justify-center lg:flex"
        >
          <AICore className="h-full w-full" />
        </motion.div>
      </div>
    </section>
  );
}
