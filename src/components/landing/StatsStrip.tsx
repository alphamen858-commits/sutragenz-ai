const stats = [
  { value: "13", label: "ways to move an idea" },
  { value: "01", label: "connected creative space" },
  { value: "24/7", label: "access when you need it" },
  { value: "∞", label: "room for possibility" },
];

export function StatsStrip() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 pb-8">
      <div className="card-surface grid grid-cols-2 gap-8 rounded-2xl px-8 py-10 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="font-display text-2xl font-semibold text-white sm:text-3xl">
              {s.value}
            </div>
            <div className="mt-1 text-sm text-white/45">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
