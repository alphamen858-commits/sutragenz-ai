import { cn } from "@/lib/utils";

// The Sutragenz mark: a fluid, ribbon-style infinity loop with a glowing,
// rainbow-iris eye at its center. Infinity = unlimited knowledge,
// eye = intelligence & vision.
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 110" className={cn("h-9 w-auto shrink-0", className)} aria-hidden="true">
      <defs>
        <linearGradient id="ribbonLeft" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2E6BFF" />
          <stop offset="45%" stopColor="#00E5FF" />
          <stop offset="100%" stopColor="#FFB020" />
        </linearGradient>
        <linearGradient id="ribbonRight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2E6BFF" />
          <stop offset="45%" stopColor="#9B5CFF" />
          <stop offset="75%" stopColor="#E84FD9" />
          <stop offset="100%" stopColor="#FF7A29" />
        </linearGradient>
        <linearGradient id="ribbonHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.7" />
        </linearGradient>
        <radialGradient id="irisGradient" cx="42%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#EAFBFF" />
          <stop offset="20%" stopColor="#5CFBFF" />
          <stop offset="45%" stopColor="#2E6BFF" />
          <stop offset="70%" stopColor="#9B5CFF" />
          <stop offset="100%" stopColor="#FF7A29" />
        </radialGradient>
        <filter id="markGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* left lobe */}
      <path
        d="M100 55
           C100 30, 78 14, 54 18
           C24 23, 8 45, 12 62
           C16 79, 34 92, 58 88
           C80 84, 96 70, 100 55 Z"
        fill="none"
        stroke="url(#ribbonLeft)"
        strokeWidth="9"
        strokeLinecap="round"
        filter="url(#markGlow)"
      />
      {/* right lobe */}
      <path
        d="M100 55
           C100 30, 122 14, 146 18
           C176 23, 192 45, 188 62
           C184 79, 166 92, 142 88
           C120 84, 104 70, 100 55 Z"
        fill="none"
        stroke="url(#ribbonRight)"
        strokeWidth="9"
        strokeLinecap="round"
        filter="url(#markGlow)"
      />
      {/* thin gloss highlight riding along the top of the ribbon */}
      <path
        d="M58 22 C34 27, 18 44, 15 58 M142 22 C166 27, 182 44, 185 58"
        fill="none"
        stroke="url(#ribbonHighlight)"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* eye — almond shape formed where the lobes cross */}
      <path
        d="M62 55 C78 38, 122 38, 138 55 C122 72, 78 72, 62 55 Z"
        fill="#05050A"
        stroke="#0F0F1C"
        strokeWidth="1"
      />
      <circle cx="100" cy="55" r="15" fill="url(#irisGradient)" />
      <circle cx="100" cy="55" r="6" fill="#05050A" />
      <circle cx="95.5" cy="50" r="2.6" fill="#FFFFFF" opacity="0.9" />
    </svg>
  );
}

export function Logo({ className, withWordmark = true }: { className?: string; withWordmark?: boolean }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <LogoMark />
      {withWordmark && (
        <span className="font-display text-xl font-semibold tracking-tight text-white">
          Sutragenz<span className="text-gradient-ai">.ai</span>
        </span>
      )}
    </div>
  );
}
