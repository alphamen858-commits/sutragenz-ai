export default function DashboardLoading() {
  // Shown instantly by Next.js while a dashboard page's server data is
  // still loading — prevents a blank white/black flash on slower
  // connections or cold database queries.
  return (
    <div className="mx-auto max-w-6xl animate-pulse">
      <div className="h-7 w-64 rounded-lg bg-white/5" />
      <div className="mt-3 h-4 w-40 rounded-lg bg-white/5" />
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-2xl bg-white/5" />
        ))}
      </div>
      <div className="mt-10 h-5 w-40 rounded-lg bg-white/5" />
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 rounded-xl bg-white/5" />
        ))}
      </div>
    </div>
  );
}
