import { FEATURES } from "@/data/features";
import { cn } from "@/lib/utils";

const accentMap = {
  cyan: "group-hover:border-cyan/50 group-hover:shadow-glow text-cyan",
  electric: "group-hover:border-electric/50 group-hover:shadow-[0_0_40px_rgba(46,107,255,0.25)] text-electric",
  violet: "group-hover:border-violet/50 group-hover:shadow-glow-violet text-violet",
};

export function Features() {
  return (
    <section id="features" className="relative mx-auto max-w-7xl px-6 py-28">
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
          Thirteen tools. One AI operating system.
        </h2>
        <p className="mt-4 text-white/55">
          Every part of the student workflow — from a homework question to a
          shipped project — in a single connected platform.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <a
              key={f.key}
              href={f.href}
              className={cn(
                "card-surface group relative rounded-2xl p-6 transition-all duration-300",
                "hover:-translate-y-1"
              )}
            >
              <div
                className={cn(
                  "mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all duration-300",
                  accentMap[f.accent]
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-base font-medium text-white">{f.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">{f.description}</p>
            </a>
          );
        })}
      </div>
    </section>
  );
}
