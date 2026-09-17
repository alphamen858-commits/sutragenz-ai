"use client";

import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/ui/Logo";

// The interactive Three.js core is disabled for now. @react-three/fiber v8
// has an open, unresolved bug with Next.js 15's bundler (their GitHub
// issue #3417 shows the exact same error this project hit) — not
// something fixable from application code. This static version keeps the
// same visual identity (glowing orb, brand colors, the logo mark) without
// depending on the broken library. Revisit real 3D once @react-three/fiber
// ships a v9 stable release built for Next 15 / React 19.
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
