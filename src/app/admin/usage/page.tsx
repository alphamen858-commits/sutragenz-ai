import { prisma } from "@/lib/prisma";

export default async function AdminUsagePage() {
  const usage = await prisma.usageEvent.groupBy({
    by: ["userId", "feature"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 50,
  });

  const users = await prisma.user.findMany({
    where: { id: { in: usage.map((u) => u.userId) } },
    select: { id: true, name: true, email: true, plan: true },
  });
  const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

  const totalByFeature = await prisma.usageEvent.groupBy({
    by: ["feature"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
  });

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-2xl font-semibold text-white">AI usage</h1>

      <h2 className="mt-6 text-sm font-medium text-white/60">Most-used tools, overall</h2>
      <div className="card-surface mt-2 overflow-hidden rounded-2xl">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 text-white/40">
            <tr>
              <th className="px-4 py-3 font-normal">Feature</th>
              <th className="px-4 py-3 font-normal">Total calls</th>
            </tr>
          </thead>
          <tbody>
            {totalByFeature.map((f) => (
              <tr key={f.feature} className="border-b border-white/5 text-white/75">
                <td className="px-4 py-3">{f.feature}</td>
                <td className="px-4 py-3">{f._count.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-8 text-sm font-medium text-white/60">Per-user, per-feature</h2>
      <div className="card-surface mt-2 overflow-hidden rounded-2xl">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 text-white/40">
            <tr>
              <th className="px-4 py-3 font-normal">User</th>
              <th className="px-4 py-3 font-normal">Plan</th>
              <th className="px-4 py-3 font-normal">Feature</th>
              <th className="px-4 py-3 font-normal">Calls</th>
            </tr>
          </thead>
          <tbody>
            {usage.map((u) => (
              <tr key={`${u.userId}-${u.feature}`} className="border-b border-white/5 text-white/75">
                <td className="px-4 py-3">{userMap[u.userId]?.name ?? userMap[u.userId]?.email ?? u.userId}</td>
                <td className="px-4 py-3">{userMap[u.userId]?.plan}</td>
                <td className="px-4 py-3">{u.feature}</td>
                <td className="px-4 py-3">{u._count.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
