import { prisma } from "@/lib/prisma";

export default async function AdminUsagePage() {
  const chats = await prisma.chat.groupBy({
    by: ["userId"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 20,
  });

  const users = await prisma.user.findMany({
    where: { id: { in: chats.map((c) => c.userId) } },
    select: { id: true, name: true, email: true },
  });
  const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-2xl font-semibold text-white">AI usage — top users</h1>
      <div className="card-surface mt-6 overflow-hidden rounded-2xl">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 text-white/40">
            <tr>
              <th className="px-4 py-3 font-normal">User</th>
              <th className="px-4 py-3 font-normal">Conversations</th>
            </tr>
          </thead>
          <tbody>
            {chats.map((c) => (
              <tr key={c.userId} className="border-b border-white/5 text-white/75">
                <td className="px-4 py-3">{userMap[c.userId]?.name ?? userMap[c.userId]?.email ?? c.userId}</td>
                <td className="px-4 py-3">{c._count.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
