import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: { id: true, name: true, email: true, plan: true, role: true, xp: true, createdAt: true },
  });

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-2xl font-semibold text-white">Users</h1>
      <div className="card-surface mt-6 overflow-hidden rounded-2xl">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 text-white/40">
            <tr>
              <th className="px-4 py-3 font-normal">Name</th>
              <th className="px-4 py-3 font-normal">Email</th>
              <th className="px-4 py-3 font-normal">Plan</th>
              <th className="px-4 py-3 font-normal">Role</th>
              <th className="px-4 py-3 font-normal">XP</th>
              <th className="px-4 py-3 font-normal">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-white/5 text-white/75">
                <td className="px-4 py-3">{u.name ?? "—"}</td>
                <td className="px-4 py-3 text-white/50">{u.email}</td>
                <td className="px-4 py-3">{u.plan}</td>
                <td className="px-4 py-3">{u.role}</td>
                <td className="px-4 py-3">{u.xp}</td>
                <td className="px-4 py-3 text-white/40">{u.createdAt.toDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
