"use client";

import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/ui/Logo";

// The interactive Three.js core is disabled — @react-three/fiber v8 has an
// open, unresolved bug with Next.js 15's bundler. This static version keeps
// the same visual identity without depending on the broken library.
export function AICore({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <div className="absolute h-full w-full animate-pulse rounded-full bg-gradient-to-br from-cyan/20 via-electric/15 to-violet/20 blur-2xl [animation-duration:4s]" />
      <div className="relative flex h-2/3 w-2/3 items-center justify-center rounded-full border border-cyan/30 bg-space-800 shadow-glow">
        <LogoMark className="h-1/2 w-auto animate-spin-slow" />
      </div>
    </div>
  );
}