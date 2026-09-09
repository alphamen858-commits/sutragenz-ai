"use client";

// Deterministic "random" particle field — same on server and client so
// there's no hydration mismatch, no external image/canvas dependency.
function seededParticles(count: number) {
  const particles = [];
  let seed = 42;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < count; i++) {
    particles.push({
      left: rand() * 100,
      top: rand() * 100,
      size: 1 + rand() * 2,
      delay: rand() * 6,
      duration: 5 + rand() * 5,
    });
  }
  return particles;
}

const particles = seededParticles(70);

export function CosmicBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* nebula blobs */}
      <div className="absolute -left-40 top-[-10%] h-[520px] w-[520px] rounded-full bg-electric/25 blur-[120px]" />
      <div className="absolute right-[-15%] top-[10%] h-[480px] w-[480px] rounded-full bg-violet/25 blur-[130px]" />
      <div className="absolute bottom-[-20%] left-[20%] h-[420px] w-[420px] rounded-full bg-cyan/15 blur-[140px]" />

      {/* starfield */}
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white/70 animate-drift"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: 0.4 + p.size / 4,
          }}
        />
      ))}

      {/* subtle grid glow at top */}
      <div className="absolute inset-0 bg-grid-glow" />
    </div>
  );
}
