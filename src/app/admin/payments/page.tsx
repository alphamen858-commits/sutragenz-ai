import { prisma } from "@/lib/prisma";

export default async function AdminPaymentsPage() {
  const subs = await prisma.subscription.findMany({
    orderBy: { startDate: "desc" },
    take: 50,
    include: { user: { select: { name: true, email: true } } },
  });

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-2xl font-semibold text-white">Payments</h1>
      <div className="card-surface mt-6 overflow-hidden rounded-2xl">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 text-white/40">
            <tr>
              <th className="px-4 py-3 font-normal">User</th>
              <th className="px-4 py-3 font-normal">Plan</th>
              <th className="px-4 py-3 font-normal">Provider</th>
              <th className="px-4 py-3 font-normal">Active</th>
              <th className="px-4 py-3 font-normal">Started</th>
            </tr>
          </thead>
          <tbody>
            {subs.map((s) => (
              <tr key={s.id} className="border-b border-white/5 text-white/75">
                <td className="px-4 py-3">{s.user.name ?? s.user.email}</td>
                <td className="px-4 py-3">{s.plan}</td>
                <td className="px-4 py-3 text-white/50">{s.provider}</td>
                <td className="px-4 py-3">{s.active ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-white/40">{s.startDate.toDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
